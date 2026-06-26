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

        // Check top-level permissions block
        Object perms = workflow.get("permissions");
        if (perms instanceof String s) {
            broadPermissions = BROAD_VALUES.contains(s);
        } else if (perms instanceof Map<?, ?> permsMap) {
            broadPermissions = permsMap.values().stream().anyMatch(v -> "write".equals(v) && permsMap.size() > 3);
            missingOidc = !"write".equals(permsMap.get("id-token"));
        }

        // Walk jobs → steps → uses
        Object jobsObj = workflow.get("jobs");
        if (jobsObj instanceof Map<?, ?> jobs) {
            for (Object jobVal : jobs.values()) {
                if (!(jobVal instanceof Map<?, ?> job)) continue;

                // Per-job permissions can also grant OIDC
                Object jobPerms = job.get("permissions");
                if (jobPerms instanceof Map<?, ?> jp && "write".equals(jp.get("id-token"))) {
                    missingOidc = false;
                }

                Object stepsObj = job.get("steps");
                if (!(stepsObj instanceof List<?> steps)) continue;

                for (Object stepObj : steps) {
                    if (!(stepObj instanceof Map<?, ?> step)) continue;
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

    private WorkflowAnalysis scored(
            String workflowPath, List<String> unpinnedActions, boolean broadPermissions, boolean missingOidc) {

        int score = 0;
        score += unpinnedActions.size() * 30;
        if (broadPermissions) score += 40;
        if (missingOidc) score += 20;
        score = Math.min(score, 100);

        return new WorkflowAnalysis(workflowPath, unpinnedActions, broadPermissions, missingOidc, score);
    }
}
