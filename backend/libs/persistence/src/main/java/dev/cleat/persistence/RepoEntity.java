package dev.cleat.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "repo")
public class RepoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @Column(nullable = false)
    private String visibility;

    private String language;
    private Integer stars = 0;
    private String defaultBranch;
    private Boolean branchProtected = false;
    private Boolean hasReadme = false;
    private Boolean hasLicense = false;
    private Boolean hasContributing = false;
    private Boolean hasCodeowners = false;
    private Boolean hasCi = false;
    private Double sizeMb = 0.0;
    private OffsetDateTime lastPushedAt;
    private Boolean archived = false;
    private Double openVulns = 0.0;
    private Double openSecrets = 0.0;
    private Integer openCodeAlerts = 0;
    private Integer staleBranches = 0;
    private Integer openPRs = 0;
    private Double hygieneScore = 0.0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public RepoEntity(
            UUID id,
            String name,
            AccountEntity account,
            String visibility,
            String language,
            Integer stars,
            String defaultBranch,
            Boolean branchProtected,
            Boolean hasReadme,
            Boolean hasLicense,
            Boolean hasContributing,
            Boolean hasCodeowners,
            Boolean hasCi,
            Double sizeMb,
            OffsetDateTime lastPushedAt,
            Boolean archived,
            Double openVulns,
            Double openSecrets,
            Integer openCodeAlerts,
            Integer staleBranches,
            Integer openPRs,
            Double hygieneScore,
            OffsetDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.account = account;
        this.visibility = visibility;
        this.language = language;
        this.stars = stars;
        this.defaultBranch = defaultBranch;
        this.branchProtected = branchProtected;
        this.hasReadme = hasReadme;
        this.hasLicense = hasLicense;
        this.hasContributing = hasContributing;
        this.hasCodeowners = hasCodeowners;
        this.hasCi = hasCi;
        this.sizeMb = sizeMb;
        this.lastPushedAt = lastPushedAt;
        this.archived = archived;
        this.openVulns = openVulns;
        this.openSecrets = openSecrets;
        this.openCodeAlerts = openCodeAlerts;
        this.staleBranches = staleBranches;
        this.openPRs = openPRs;
        this.hygieneScore = hygieneScore;
        this.createdAt = createdAt;
    }

    public RepoEntity() {}

    public UUID getId() {
        return id;
    }

    public RepoEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public RepoEntity setName(String name) {
        this.name = name;
        return this;
    }

    public AccountEntity getAccount() {
        return account;
    }

    public RepoEntity setAccount(AccountEntity account) {
        this.account = account;
        return this;
    }

    public String getVisibility() {
        return visibility;
    }

    public RepoEntity setVisibility(String visibility) {
        this.visibility = visibility;
        return this;
    }

    public String getLanguage() {
        return language;
    }

    public RepoEntity setLanguage(String language) {
        this.language = language;
        return this;
    }

    public Integer getStars() {
        return stars;
    }

    public RepoEntity setStars(Integer stars) {
        this.stars = stars;
        return this;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public RepoEntity setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
        return this;
    }

    public Boolean getBranchProtected() {
        return branchProtected;
    }

    public RepoEntity setBranchProtected(Boolean branchProtected) {
        this.branchProtected = branchProtected;
        return this;
    }

    public Boolean getHasReadme() {
        return hasReadme;
    }

    public RepoEntity setHasReadme(Boolean hasReadme) {
        this.hasReadme = hasReadme;
        return this;
    }

    public Boolean getHasLicense() {
        return hasLicense;
    }

    public RepoEntity setHasLicense(Boolean hasLicense) {
        this.hasLicense = hasLicense;
        return this;
    }

    public Boolean getHasContributing() {
        return hasContributing;
    }

    public RepoEntity setHasContributing(Boolean hasContributing) {
        this.hasContributing = hasContributing;
        return this;
    }

    public Boolean getHasCodeowners() {
        return hasCodeowners;
    }

    public RepoEntity setHasCodeowners(Boolean hasCodeowners) {
        this.hasCodeowners = hasCodeowners;
        return this;
    }

    public Boolean getHasCi() {
        return hasCi;
    }

    public RepoEntity setHasCi(Boolean hasCi) {
        this.hasCi = hasCi;
        return this;
    }

    public Double getSizeMb() {
        return sizeMb;
    }

    public RepoEntity setSizeMb(Double sizeMb) {
        this.sizeMb = sizeMb;
        return this;
    }

    public OffsetDateTime getLastPushedAt() {
        return lastPushedAt;
    }

    public RepoEntity setLastPushedAt(OffsetDateTime lastPushedAt) {
        this.lastPushedAt = lastPushedAt;
        return this;
    }

    public Boolean getArchived() {
        return archived;
    }

    public RepoEntity setArchived(Boolean archived) {
        this.archived = archived;
        return this;
    }

    public Double getOpenVulns() {
        return openVulns;
    }

    public RepoEntity setOpenVulns(Double openVulns) {
        this.openVulns = openVulns;
        return this;
    }

    public Double getOpenSecrets() {
        return openSecrets;
    }

    public RepoEntity setOpenSecrets(Double openSecrets) {
        this.openSecrets = openSecrets;
        return this;
    }

    public Integer getOpenCodeAlerts() {
        return openCodeAlerts;
    }

    public RepoEntity setOpenCodeAlerts(Integer openCodeAlerts) {
        this.openCodeAlerts = openCodeAlerts;
        return this;
    }

    public Integer getStaleBranches() {
        return staleBranches;
    }

    public RepoEntity setStaleBranches(Integer staleBranches) {
        this.staleBranches = staleBranches;
        return this;
    }

    public Integer getOpenPRs() {
        return openPRs;
    }

    public RepoEntity setOpenPRs(Integer openPRs) {
        this.openPRs = openPRs;
        return this;
    }

    public Double getHygieneScore() {
        return hygieneScore;
    }

    public RepoEntity setHygieneScore(Double hygieneScore) {
        this.hygieneScore = hygieneScore;
        return this;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public RepoEntity setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
