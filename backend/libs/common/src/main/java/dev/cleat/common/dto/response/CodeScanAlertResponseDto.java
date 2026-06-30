package dev.cleat.common.dto.response;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Status;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CodeScanAlertResponseDto {

    private UUID id;
    private UUID accountId;
    private UUID repo;
    private String rule;
    private UUID ruleId;
    private Severity severity;
    private String file;
    private Integer line;
    private String branch;
    private Status status;
    private String tool;
    private OffsetDateTime detectedAt;
    private String description;

    public CodeScanAlertResponseDto() {}

    public CodeScanAlertResponseDto(
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

    public CodeScanAlertResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public CodeScanAlertResponseDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public UUID getRepo() {
        return repo;
    }

    public CodeScanAlertResponseDto setRepo(UUID repo) {
        this.repo = repo;
        return this;
    }

    public String getRule() {
        return rule;
    }

    public CodeScanAlertResponseDto setRule(String rule) {
        this.rule = rule;
        return this;
    }

    public UUID getRuleId() {
        return ruleId;
    }

    public CodeScanAlertResponseDto setRuleId(UUID ruleId) {
        this.ruleId = ruleId;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public CodeScanAlertResponseDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getFile() {
        return file;
    }

    public CodeScanAlertResponseDto setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public CodeScanAlertResponseDto setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getBranch() {
        return branch;
    }

    public CodeScanAlertResponseDto setBranch(String branch) {
        this.branch = branch;
        return this;
    }

    public Status getStatus() {
        return status;
    }

    public CodeScanAlertResponseDto setStatus(Status status) {
        this.status = status;
        return this;
    }

    public String getTool() {
        return tool;
    }

    public CodeScanAlertResponseDto setTool(String tool) {
        this.tool = tool;
        return this;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public CodeScanAlertResponseDto setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public CodeScanAlertResponseDto setDescription(String description) {
        this.description = description;
        return this;
    }
}
