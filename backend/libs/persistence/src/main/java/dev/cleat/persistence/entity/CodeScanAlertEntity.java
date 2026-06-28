package dev.cleat.persistence.entity;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "code_scan_alerts")
public class CodeScanAlertEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_id")
    private UUID accountId;

    @Column(name = "repo")
    private UUID repo;

    @Column(name = "rule")
    private String rule;

    @Column(name = "rule_id")
    private UUID ruleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity;

    @Column(name = "file")
    private String file;

    @Column(name = "line")
    private Integer line;

    @Column(name = "branch")
    private String branch;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "tool")
    private String tool;

    @Column(name = "detected_at")
    private OffsetDateTime detectedAt;

    @Column(name = "description")
    private String description;

    public CodeScanAlertEntity() {}

    public CodeScanAlertEntity(
            UUID id,
            UUID accountId,
            UUID repo,
            String rule,
            UUID ruleId,
            Severity severity,
            String file,
            Integer line,
            String branch,
            Status status,
            String tool,
            OffsetDateTime detectedAt,
            String description) {
        this.id = id;
        this.accountId = accountId;
        this.repo = repo;
        this.rule = rule;
        this.ruleId = ruleId;
        this.severity = severity;
        this.file = file;
        this.line = line;
        this.branch = branch;
        this.status = status;
        this.tool = tool;
        this.detectedAt = detectedAt;
        this.description = description;
    }

    public UUID getId() {
        return id;
    }

    public CodeScanAlertEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public CodeScanAlertEntity setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public UUID getRepo() {
        return repo;
    }

    public CodeScanAlertEntity setRepo(UUID repo) {
        this.repo = repo;
        return this;
    }

    public String getRule() {
        return rule;
    }

    public CodeScanAlertEntity setRule(String rule) {
        this.rule = rule;
        return this;
    }

    public UUID getRuleId() {
        return ruleId;
    }

    public CodeScanAlertEntity setRuleId(UUID ruleId) {
        this.ruleId = ruleId;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public CodeScanAlertEntity setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getFile() {
        return file;
    }

    public CodeScanAlertEntity setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public CodeScanAlertEntity setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getBranch() {
        return branch;
    }

    public CodeScanAlertEntity setBranch(String branch) {
        this.branch = branch;
        return this;
    }

    public Status getStatus() {
        return status;
    }

    public CodeScanAlertEntity setStatus(Status status) {
        this.status = status;
        return this;
    }

    public String getTool() {
        return tool;
    }

    public CodeScanAlertEntity setTool(String tool) {
        this.tool = tool;
        return this;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public CodeScanAlertEntity setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public CodeScanAlertEntity setDescription(String description) {
        this.description = description;
        return this;
    }
}
