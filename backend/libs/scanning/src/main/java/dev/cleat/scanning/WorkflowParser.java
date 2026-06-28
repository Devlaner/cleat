package dev.cleat.scanning;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;

@Component
public class WorkflowParser {

    // Pinned action: owner/repo@<40-char SHA>
    private static final Pattern PINNED = Pattern.compile("^[^@]+@[0-9a-f]{40}$");

    private static final List<String> BROAD_VALUES = List.of("write-all", "read-all");

    @SuppressWarnings("unchecked")
    public WorkflowAnalysis parse(String workflowPath, String yamlContent) {
        Yaml yaml = new Yaml();
        Map<String, Object> workflow = yaml.load(yamlContent);

        List<String> unpinnedActions = new ArrayList<>();
        boolean broadPermissions = false;
        boolean missingOidc = true;

        if (workflow == null) {
            return scored(workflowPath, unpinnedActions, broadPermissions, missingOidc);
        }

        // Check top-level permissions
        var topPerms = getPermissionStatus(workflow.get("permissions"));
        broadPermissions = topPerms.broad();
        if (topPerms.oidcWrite()) {
            missingOidc = false;
        }

        // Walk jobs
        Object jobsObj = workflow.get("jobs");
        if (jobsObj instanceof Map<?, ?> jobs) {
            for (Object jobVal : jobs.values()) {
                if (!(jobVal instanceof Map<?, ?> job)) {
                    continue;
                }

                // Check job-level permissions
                var jobPerms = getPermissionStatus(job.get("permissions"));
                if (jobPerms.broad()) {
                    broadPermissions = true;
                }
                if (jobPerms.oidcWrite()) {
                    missingOidc = false;
                }

                Object stepsObj = job.get("steps");
                if (!(stepsObj instanceof List<?> steps)) {
                    continue;
                }

                for (Object stepObj : steps) {
                    if (!(stepObj instanceof Map<?, ?> step)) {
                        continue;
                    }
                    Object uses = step.get("uses");
                    if (uses instanceof String action && !action.isBlank()) {
                        if (!PINNED.matcher(action).matches()) {
                            unpinnedActions.add(action);
                        }
                    }
                }
            }
        }

        return scored(workflowPath, unpinnedActions, broadPermissions, missingOidc);
    }

    private PermissionStatus getPermissionStatus(Object perms) {
        if (perms instanceof String s) {
            boolean isBroad = BROAD_VALUES.contains(s);
            boolean isOidc = "write-all".equals(s);
            return new PermissionStatus(isBroad, isOidc);
        } else if (perms instanceof Map<?, ?> map) {
            boolean isOidc = "write".equals(map.get("id-token"));
            boolean isBroad = map.values().stream().anyMatch(v -> "write".equals(v));
            return new PermissionStatus(isBroad, isOidc);
        }
        return new PermissionStatus(false, false);
    }

    private record PermissionStatus(boolean broad, boolean oidcWrite) {}

    private WorkflowAnalysis scored(
            String workflowPath, List<String> unpinnedActions, boolean broadPermissions, boolean missingOidc) {

        int score = 0;
        score += unpinnedActions.size() * 30;
        if (broadPermissions) {
            score += 40;
        }
        if (missingOidc) {
            score += 20;
        }
        score = Math.min(score, 100);

        return new WorkflowAnalysis(workflowPath, unpinnedActions, broadPermissions, missingOidc, score);
    }
}
