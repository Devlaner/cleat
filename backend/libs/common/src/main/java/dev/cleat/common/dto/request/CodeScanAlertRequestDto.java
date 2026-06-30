package dev.cleat.common.dto.request;

import dev.cleat.common.enums.Severity;
import java.util.UUID;

public class CodeScanAlertRequestDto {

    private UUID accountId;
    private UUID repo;
    private String rule;
    private UUID ruleId;
    private Severity severity;
    private String file;
    private Integer line;
    private String branch;
    private String tool;
    private String description;

    public CodeScanAlertRequestDto() {}

    public CodeScanAlertRequestDto(
            UUID accountId,
            UUID repo,
            String rule,
            UUID ruleId,
            Severity severity,
            String file,
            Integer line,
            String branch,
            String tool,
            String description) {
        this.accountId = accountId;
        this.repo = repo;
        this.rule = rule;
        this.ruleId = ruleId;
        this.severity = severity;
        this.file = file;
        this.line = line;
        this.branch = branch;
        this.tool = tool;
        this.description = description;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public CodeScanAlertRequestDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public UUID getRepo() {
        return repo;
    }

    public CodeScanAlertRequestDto setRepo(UUID repo) {
        this.repo = repo;
        return this;
    }

    public String getRule() {
        return rule;
    }

    public CodeScanAlertRequestDto setRule(String rule) {
        this.rule = rule;
        return this;
    }

    public UUID getRuleId() {
        return ruleId;
    }

    public CodeScanAlertRequestDto setRuleId(UUID ruleId) {
        this.ruleId = ruleId;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public CodeScanAlertRequestDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getFile() {
        return file;
    }

    public CodeScanAlertRequestDto setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public CodeScanAlertRequestDto setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getBranch() {
        return branch;
    }

    public CodeScanAlertRequestDto setBranch(String branch) {
        this.branch = branch;
        return this;
    }

    public String getTool() {
        return tool;
    }

    public CodeScanAlertRequestDto setTool(String tool) {
        this.tool = tool;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public CodeScanAlertRequestDto setDescription(String description) {
        this.description = description;
        return this;
    }
}
