package dev.cleat.scanning;

import dev.cleat.githubclient.service.GitHubClient;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.WorkflowScanEntity;
import dev.cleat.persistence.repository.WorkflowScanRepository;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WorkflowScanService {

    private static final Logger LOG = LoggerFactory.getLogger(WorkflowScanService.class);

    private final GitHubClient gitHubClient;
    private final WorkflowParser workflowParser;
    private final WorkflowScanRepository workflowScanRepository;

    public WorkflowScanService(
            GitHubClient gitHubClient, WorkflowParser workflowParser, WorkflowScanRepository workflowScanRepository) {
        this.gitHubClient = gitHubClient;
        this.workflowParser = workflowParser;
        this.workflowScanRepository = workflowScanRepository;
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public List<WorkflowScanEntity> scanRepo(RepoEntity repo, String installationId) {
        String owner = repo.getAccount().getLogin();
        String repoName = repo.getName();

        // 1. Fetch list of workflow files from GitHub
        List<Map<String, Object>> files = gitHubClient.get(
                "/repos/" + owner + "/" + repoName + "/contents/.github/workflows", installationId, List.class);

        if (files == null || files.isEmpty()) {
            LOG.debug("No workflows found for {}/{}", owner, repoName);
            return List.of();
        }

        // 2. Delete previous scans for this repo before inserting fresh ones
        workflowScanRepository.deleteByRepoId(repo.getId());

        List<WorkflowScanEntity> results = new ArrayList<>();

        for (Map<String, Object> file : files) {
            String path = (String) file.get("path");
            if (path == null || (!path.endsWith(".yml") && !path.endsWith(".yaml"))) {
                continue;
            }

            // 3. Fetch raw YAML content
            String downloadUrl = (String) file.get("download_url");
            if (downloadUrl == null) {
                continue;
            }

            String yamlContent = gitHubClient.get(downloadUrl, installationId, String.class);
            if (yamlContent == null) {
                continue;
            }

            // 4. Parse and score
            WorkflowAnalysis analysis = workflowParser.parse(path, yamlContent);
            LOG.info(
                    "Scanned {}/{}/{} — score={} unpinned={} broadPerms={} missingOidc={}",
                    owner,
                    repoName,
                    path,
                    analysis.riskScore(),
                    analysis.unpinnedActions().size(),
                    analysis.broadPermissions(),
                    analysis.missingOidc());

            // 5. Persist
            WorkflowScanEntity entity = new WorkflowScanEntity()
                    .setRepo(repo)
                    .setWorkflowPath(path)
                    .setUnpinnedActions(analysis.unpinnedActions().size())
                    .setBroadPermissions(analysis.broadPermissions())
                    .setMissingOidc(analysis.missingOidc())
                    .setRiskScore(analysis.riskScore())
                    .setScannedAt(OffsetDateTime.now());

            results.add(workflowScanRepository.save(entity));
        }

        return results;
    }
}
