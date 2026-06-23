package dev.cleat.common.dto.response;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Validity;
import java.time.OffsetDateTime;
import java.util.UUID;

public class SecretFindingResponseDto {
    private UUID id;
    private UUID accountId;
    private String repo;
    private String provider;
    private String secretType;
    private String file;
    private Integer line;
    private String commit;
    private String author;
    private OffsetDateTime detectedAt;
    private Validity validity;
    private Severity severity;
    private Boolean pushProtectionBlocked;

    public UUID getId() {
        return id;
    }

    public SecretFindingResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public SecretFindingResponseDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public String getRepo() {
        return repo;
    }

    public SecretFindingResponseDto setRepo(String repo) {
        this.repo = repo;
        return this;
    }

    public String getProvider() {
        return provider;
    }

    public SecretFindingResponseDto setProvider(String provider) {
        this.provider = provider;
        return this;
    }

    public String getSecretType() {
        return secretType;
    }

    public SecretFindingResponseDto setSecretType(String secretType) {
        this.secretType = secretType;
        return this;
    }

    public String getFile() {
        return file;
    }

    public SecretFindingResponseDto setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public SecretFindingResponseDto setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getCommit() {
        return commit;
    }

    public SecretFindingResponseDto setCommit(String commit) {
        this.commit = commit;
        return this;
    }

    public String getAuthor() {
        return author;
    }

    public SecretFindingResponseDto setAuthor(String author) {
        this.author = author;
        return this;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public SecretFindingResponseDto setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
        return this;
    }

    public Validity getValidity() {
        return validity;
    }

    public SecretFindingResponseDto setValidity(Validity validity) {
        this.validity = validity;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public SecretFindingResponseDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public Boolean getPushProtectionBlocked() {
        return pushProtectionBlocked;
    }

    public SecretFindingResponseDto setPushProtectionBlocked(Boolean pushProtectionBlocked) {
        this.pushProtectionBlocked = pushProtectionBlocked;
        return this;
    }
}
