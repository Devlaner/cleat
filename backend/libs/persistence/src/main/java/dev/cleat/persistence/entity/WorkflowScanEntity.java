package dev.cleat.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "workflow_scan")
public class WorkflowScanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id", nullable = false)
    private RepoEntity repo;

    @Column(name = "workflow_path", nullable = false)
    private String workflowPath;

    @Column(name = "unpinned_actions", nullable = false)
    private Integer unpinnedActions;

    @Column(name = "broad_permissions", nullable = false)
    private Boolean broadPermissions;

    @Column(name = "missing_oidc", nullable = false)
    private Boolean missingOidc;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "scanned_at", nullable = false)
    private OffsetDateTime scannedAt;

    public WorkflowScanEntity() {}

    public UUID getId() {
        return id;
    }

    public WorkflowScanEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public RepoEntity getRepo() {
        return repo;
    }

    public WorkflowScanEntity setRepo(RepoEntity repo) {
        this.repo = repo;
        return this;
    }

    public String getWorkflowPath() {
        return workflowPath;
    }

    public WorkflowScanEntity setWorkflowPath(String workflowPath) {
        this.workflowPath = workflowPath;
        return this;
    }

    public Integer getUnpinnedActions() {
        return unpinnedActions;
    }

    public WorkflowScanEntity setUnpinnedActions(Integer unpinnedActions) {
        this.unpinnedActions = unpinnedActions;
        return this;
    }

    public Boolean getBroadPermissions() {
        return broadPermissions;
    }

    public WorkflowScanEntity setBroadPermissions(Boolean broadPermissions) {
        this.broadPermissions = broadPermissions;
        return this;
    }

    public Boolean getMissingOidc() {
        return missingOidc;
    }

    public WorkflowScanEntity setMissingOidc(Boolean missingOidc) {
        this.missingOidc = missingOidc;
        return this;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public WorkflowScanEntity setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
        return this;
    }

    public OffsetDateTime getScannedAt() {
        return scannedAt;
    }

    public WorkflowScanEntity setScannedAt(OffsetDateTime scannedAt) {
        this.scannedAt = scannedAt;
        return this;
    }
}
