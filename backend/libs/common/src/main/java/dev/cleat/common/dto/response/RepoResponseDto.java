package dev.cleat.common.dto.response;

import dev.cleat.common.enums.Visibility;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class RepoResponseDto {
    private UUID id;
    private String name;
    private UUID accountId;
    private Visibility visibility;
    private String language;
    private Integer stars;
    private String defaultBranch;
    private Boolean branchProtected;
    private Boolean hasReadme;
    private Boolean hasLicense;
    private Boolean hasContributing;
    private Boolean hasCodeowners;
    private Boolean hasCI;
    private Double sizeMb;
    private OffsetDateTime lastPushedAt;
    private Boolean archived;
    private Integer openVulns;
    private Integer openSecrets;
    private Integer openCodeAlerts;
    private Integer staleBranches;
    private Integer openPRs;
    private Integer hygieneScore;
    private List<ScorecardCheckResponseDto> scorecard;
    private List<String> topics;

    public UUID getId() {
        return id;
    }

    public RepoResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public RepoResponseDto setName(String name) {
        this.name = name;
        return this;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public RepoResponseDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public RepoResponseDto setVisibility(Visibility visibility) {
        this.visibility = visibility;
        return this;
    }

    public String getLanguage() {
        return language;
    }

    public RepoResponseDto setLanguage(String language) {
        this.language = language;
        return this;
    }

    public Integer getStars() {
        return stars;
    }

    public RepoResponseDto setStars(Integer stars) {
        this.stars = stars;
        return this;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public RepoResponseDto setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
        return this;
    }

    public Boolean getBranchProtected() {
        return branchProtected;
    }

    public RepoResponseDto setBranchProtected(Boolean branchProtected) {
        this.branchProtected = branchProtected;
        return this;
    }

    public Boolean getHasReadme() {
        return hasReadme;
    }

    public RepoResponseDto setHasReadme(Boolean hasReadme) {
        this.hasReadme = hasReadme;
        return this;
    }

    public Boolean getHasLicense() {
        return hasLicense;
    }

    public RepoResponseDto setHasLicense(Boolean hasLicense) {
        this.hasLicense = hasLicense;
        return this;
    }

    public Boolean getHasContributing() {
        return hasContributing;
    }

    public RepoResponseDto setHasContributing(Boolean hasContributing) {
        this.hasContributing = hasContributing;
        return this;
    }

    public Boolean getHasCodeowners() {
        return hasCodeowners;
    }

    public RepoResponseDto setHasCodeowners(Boolean hasCodeowners) {
        this.hasCodeowners = hasCodeowners;
        return this;
    }

    public Boolean getHasCI() {
        return hasCI;
    }

    public RepoResponseDto setHasCI(Boolean hasCI) {
        this.hasCI = hasCI;
        return this;
    }

    public Double getSizeMb() {
        return sizeMb;
    }

    public RepoResponseDto setSizeMb(Double sizeMb) {
        this.sizeMb = sizeMb;
        return this;
    }

    public OffsetDateTime getLastPushedAt() {
        return lastPushedAt;
    }

    public RepoResponseDto setLastPushedAt(OffsetDateTime lastPushedAt) {
        this.lastPushedAt = lastPushedAt;
        return this;
    }

    public Boolean getArchived() {
        return archived;
    }

    public RepoResponseDto setArchived(Boolean archived) {
        this.archived = archived;
        return this;
    }

    public Integer getOpenVulns() {
        return openVulns;
    }

    public RepoResponseDto setOpenVulns(Integer openVulns) {
        this.openVulns = openVulns;
        return this;
    }

    public Integer getOpenSecrets() {
        return openSecrets;
    }

    public RepoResponseDto setOpenSecrets(Integer openSecrets) {
        this.openSecrets = openSecrets;
        return this;
    }

    public Integer getOpenCodeAlerts() {
        return openCodeAlerts;
    }

    public RepoResponseDto setOpenCodeAlerts(Integer openCodeAlerts) {
        this.openCodeAlerts = openCodeAlerts;
        return this;
    }

    public Integer getStaleBranches() {
        return staleBranches;
    }

    public RepoResponseDto setStaleBranches(Integer staleBranches) {
        this.staleBranches = staleBranches;
        return this;
    }

    public Integer getOpenPRs() {
        return openPRs;
    }

    public RepoResponseDto setOpenPRs(Integer openPRs) {
        this.openPRs = openPRs;
        return this;
    }

    public Integer getHygieneScore() {
        return hygieneScore;
    }

    public RepoResponseDto setHygieneScore(Integer hygieneScore) {
        this.hygieneScore = hygieneScore;
        return this;
    }

    public List<ScorecardCheckResponseDto> getScorecard() {
        return scorecard;
    }

    public RepoResponseDto setScorecard(List<ScorecardCheckResponseDto> scorecard) {
        this.scorecard = scorecard;
        return this;
    }

    public List<String> getTopics() {
        return topics;
    }

    public RepoResponseDto setTopics(List<String> topics) {
        this.topics = topics;
        return this;
    }
}
