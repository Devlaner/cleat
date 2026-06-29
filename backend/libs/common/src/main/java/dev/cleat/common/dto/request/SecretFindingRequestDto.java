package dev.cleat.common.dto.request;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Validity;
import java.time.OffsetDateTime;
import java.util.UUID;

public class SecretFindingRequestDto {
    private UUID accountId;
    private UUID repoId;
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

    public SecretFindingRequestDto() {}

    public SecretFindingRequestDto(
            UUID accountId,
            UUID repoId,
            String provider,
            String secretType,
            String file,
            Integer line,
            String commit,
            String author,
            OffsetDateTime detectedAt,
            Validity validity,
            Severity severity,
            Boolean pushProtectionBlocked) {

        this.accountId = accountId;
        this.repoId = repoId;
        this.provider = provider;
        this.secretType = secretType;
        this.file = file;
        this.line = line;
        this.commit = commit;
        this.author = author;
        this.detectedAt = detectedAt;
        this.validity = validity;
        this.severity = severity;
        this.pushProtectionBlocked = pushProtectionBlocked;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public SecretFindingRequestDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public UUID getRepoId() {
        return repoId;
    }

    public SecretFindingRequestDto setRepoId(UUID repoId) {
        this.repoId = repoId;
        return this;
    }

    public String getProvider() {
        return provider;
    }

    public SecretFindingRequestDto setProvider(String provider) {
        this.provider = provider;
        return this;
    }

    public String getSecretType() {
        return secretType;
    }

    public SecretFindingRequestDto setSecretType(String secretType) {
        this.secretType = secretType;
        return this;
    }

    public String getFile() {
        return file;
    }

    public SecretFindingRequestDto setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public SecretFindingRequestDto setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getCommit() {
        return commit;
    }

    public SecretFindingRequestDto setCommit(String commit) {
        this.commit = commit;
        return this;
    }

    public String getAuthor() {
        return author;
    }

    public SecretFindingRequestDto setAuthor(String author) {
        this.author = author;
        return this;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public SecretFindingRequestDto setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
        return this;
    }

    public Validity getValidity() {
        return validity;
    }

    public SecretFindingRequestDto setValidity(Validity validity) {
        this.validity = validity;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public SecretFindingRequestDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public Boolean getPushProtectionBlocked() {
        return pushProtectionBlocked;
    }

    public SecretFindingRequestDto setPushProtectionBlocked(Boolean pushProtectionBlocked) {
        this.pushProtectionBlocked = pushProtectionBlocked;
        return this;
    }
}
