package dev.cleat.persistence;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "account")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String login;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String plan;

    @Column(name = "repo_count")
    private Integer repoCount = 0;

    @Column(name = "member_count")
    private Integer memberCount = 0;

    @Column(name = "posture_score")
    private Double postureScore = 0.0;

    @Column(name = "monthly_spend")
    private Double monthlySpend = 0.0;

    @Column(name = "reclaimable")
    private Double reclaimable = 0.0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepoEntity> repos = new ArrayList<>();

    public AccountEntity(
            UUID id,
            String login,
            String name,
            String type,
            String plan,
            Integer repoCount,
            Integer memberCount,
            Double postureScore,
            Double monthlySpend,
            Double reclaimable,
            OffsetDateTime createdAt,
            List<RepoEntity> repos) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.type = type;
        this.plan = plan;
        this.repoCount = repoCount;
        this.memberCount = memberCount;
        this.postureScore = postureScore;
        this.monthlySpend = monthlySpend;
        this.reclaimable = reclaimable;
        this.createdAt = createdAt;
        this.repos = repos;
    }

    public AccountEntity() {}

    public UUID getId() {
        return id;
    }

    public AccountEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public AccountEntity setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public AccountEntity setName(String name) {
        this.name = name;
        return this;
    }

    public String getType() {
        return type;
    }

    public AccountEntity setType(String type) {
        this.type = type;
        return this;
    }

    public String getPlan() {
        return plan;
    }

    public AccountEntity setPlan(String plan) {
        this.plan = plan;
        return this;
    }

    public Integer getRepoCount() {
        return repoCount;
    }

    public AccountEntity setRepoCount(Integer repoCount) {
        this.repoCount = repoCount;
        return this;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public AccountEntity setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
        return this;
    }

    public Double getPostureScore() {
        return postureScore;
    }

    public AccountEntity setPostureScore(Double postureScore) {
        this.postureScore = postureScore;
        return this;
    }

    public Double getMonthlySpend() {
        return monthlySpend;
    }

    public AccountEntity setMonthlySpend(Double monthlySpend) {
        this.monthlySpend = monthlySpend;
        return this;
    }

    public Double getReclaimable() {
        return reclaimable;
    }

    public AccountEntity setReclaimable(Double reclaimable) {
        this.reclaimable = reclaimable;
        return this;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public AccountEntity setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public List<RepoEntity> getRepos() {
        return repos;
    }

    public AccountEntity setRepos(List<RepoEntity> repos) {
        this.repos = repos;
        return this;
    }
}
