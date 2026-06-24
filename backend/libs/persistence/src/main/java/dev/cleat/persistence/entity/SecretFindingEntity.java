package dev.cleat.persistence.entity;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Validity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "secret_finding")
public class SecretFindingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private AccountEntity account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo")
    private RepoEntity repo;

    @Column(name = "provider")
    private String provider;

    @Column(name = "secret_type")
    private String secretType;

    @Column(name = "file")
    private String file;

    @Column(name = "line")
    private Integer line;

    @Column(name = "commit")
    private String commit;

    @Column(name = "author")
    private String author;

    @Column(name = "detected_at")
    private OffsetDateTime detectedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "validity")
    private Validity validity;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity;

    @Column(name = "push_protection_blocked")
    private Boolean pushProtectionBlocked;

    public SecretFindingEntity() {}

    public SecretFindingEntity(
            UUID id,
            AccountEntity account,
            RepoEntity repo,
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
        this.id = id;
        this.account = account;
        this.repo = repo;
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

    public UUID getId() {
        return id;
    }

    public SecretFindingEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public AccountEntity getAccount() {
        return account;
    }

    public SecretFindingEntity setAccount(AccountEntity account) {
        this.account = account;
        return this;
    }

    public RepoEntity getRepo() {
        return repo;
    }

    public SecretFindingEntity setRepo(RepoEntity repo) {
        this.repo = repo;
        return this;
    }

    public String getProvider() {
        return provider;
    }

    public SecretFindingEntity setProvider(String provider) {
        this.provider = provider;
        return this;
    }

    public String getSecretType() {
        return secretType;
    }

    public SecretFindingEntity setSecretType(String secretType) {
        this.secretType = secretType;
        return this;
    }

    public String getFile() {
        return file;
    }

    public SecretFindingEntity setFile(String file) {
        this.file = file;
        return this;
    }

    public Integer getLine() {
        return line;
    }

    public SecretFindingEntity setLine(Integer line) {
        this.line = line;
        return this;
    }

    public String getCommit() {
        return commit;
    }

    public SecretFindingEntity setCommit(String commit) {
        this.commit = commit;
        return this;
    }

    public String getAuthor() {
        return author;
    }

    public SecretFindingEntity setAuthor(String author) {
        this.author = author;
        return this;
    }

    public OffsetDateTime getDetectedAt() {
        return detectedAt;
    }

    public SecretFindingEntity setDetectedAt(OffsetDateTime detectedAt) {
        this.detectedAt = detectedAt;
        return this;
    }

    public Validity getValidity() {
        return validity;
    }

    public SecretFindingEntity setValidity(Validity validity) {
        this.validity = validity;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public SecretFindingEntity setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public Boolean getPushProtectionBlocked() {
        return pushProtectionBlocked;
    }

    public SecretFindingEntity setPushProtectionBlocked(Boolean pushProtectionBlocked) {
        this.pushProtectionBlocked = pushProtectionBlocked;
        return this;
    }
}
