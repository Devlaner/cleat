package dev.cleat.api.controller;

import dev.cleat.persistence.entity.WorkflowScanEntity;
import dev.cleat.persistence.repository.WorkflowScanRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/repos")
public class WorkflowScanController {

    private final WorkflowScanRepository workflowScanRepository;

    public WorkflowScanController(WorkflowScanRepository workflowScanRepository) {
        this.workflowScanRepository = workflowScanRepository;
    }

    @GetMapping("/{repoId}/workflow-scans")
    public List<WorkflowScanResponse> getWorkflowScans(@PathVariable UUID repoId) {
        return workflowScanRepository.findByRepoIdOrderByScannedAtDesc(repoId).stream()
                .map(WorkflowScanResponse::from)
                .toList();
    }

    public record WorkflowScanResponse(
            UUID id,
            String workflowPath,
            int unpinnedActions,
            boolean broadPermissions,
            boolean missingOidc,
            int riskScore,
            OffsetDateTime scannedAt) {

        public static WorkflowScanResponse from(WorkflowScanEntity entity) {
            return new WorkflowScanResponse(
                    entity.getId(),
                    entity.getWorkflowPath(),
                    entity.getUnpinnedActions(),
                    entity.getBroadPermissions(),
                    entity.getMissingOidc(),
                    entity.getRiskScore(),
                    entity.getScannedAt());
        }
    }
}
