package dev.cleat.persistence;

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
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "repo")
public class RepoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @Column(name = "visibility")
    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    @Column(name = "language")
    private String language;

    @Column(name = "stars")
    private Integer stars;

    @Column(name = "default_branch")
    private String defaultBranch;

    @Column(name = "branch_protected")
    private Boolean branchProtected;

    @Column(name = "has_readme")
    private Boolean hasReadme;

    @Column(name = "has_license")
    private Boolean hasLicense;

    @Column(name = "has_contributing")
    private Boolean hasContributing;

    @Column(name = "has_codeowners")
    private Boolean hasCodeowners;

    @Column(name = "has_ci")
    private Boolean hasCi;

    @Column(name = "size_mb")
    private Double sizeMb;

    @Column(name = "last_pushed_at")
    private OffsetDateTime lastPushedAt;

    @Column(name = "archived")
    private Boolean archived;

    @Column(name = "open_vulns")
    private Integer openVulns;

    @Column(name = "open_secrets")
    private Integer openSecrets;

    @Column(name = "open_code_alerts")
    private Integer openCodeAlerts;

    @Column(name = "stale_branches")
    private Integer staleBranches;

    @Column(name = "open_prs")
    private Integer openPRs;

    @Column(name = "hygiene_score")
    private Double hygieneScore;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public RepoEntity(
            UUID id,
            String name,
            AccountEntity account,
            Visibility visibility,
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
            Integer openVulns,
            Integer openSecrets,
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

    public Visibility getVisibility() {
        return visibility;
    }

    public RepoEntity setVisibility(Visibility visibility) {
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

    public Integer getOpenVulns() {
        return openVulns;
    }

    public RepoEntity setOpenVulns(Integer openVulns) {
        this.openVulns = openVulns;
        return this;
    }

    public Integer getOpenSecrets() {
        return openSecrets;
    }

    public RepoEntity setOpenSecrets(Integer openSecrets) {
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
