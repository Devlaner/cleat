package dev.cleat.persistence.entity;

import dev.cleat.common.enums.AccountType;
import dev.cleat.common.enums.Plan;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
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

    @Column(name = "login", nullable = false)
    private String login;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType type;

    @Column(name = "plan")
    @Enumerated(EnumType.STRING)
    private Plan plan;

    @Column(name = "repo_count")
    private Integer repoCount;

    @Column(name = "member_count")
    private Integer memberCount;

    @Column(name = "posture_score")
    private Integer postureScore;

    @Column(name = "monthly_spend")
    private BigDecimal monthlySpend;

    @Column(name = "reclaimable")
    private BigDecimal reclaimable;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepoEntity> repos = new ArrayList<>();

    public AccountEntity(
            UUID id,
            String login,
            String name,
            AccountType type,
            Plan plan,
            Integer repoCount,
            Integer memberCount,
            Integer postureScore,
            BigDecimal monthlySpend,
            BigDecimal reclaimable,
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


    public dev.cleat.common.enums.AccountType getType() {
        return type;
    }

    public AccountEntity setType(AccountType type) {
        this.type = type;
        return this;
    }


    public dev.cleat.common.enums.Plan getPlan() {
        return plan;
    }

    public AccountEntity setPlan(Plan plan) {
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

    public Integer getPostureScore() {
        return postureScore;
    }

    public AccountEntity setPostureScore(Integer postureScore) {
        this.postureScore = postureScore;
        return this;
    }

    public BigDecimal getMonthlySpend() {
        return monthlySpend;
    }

    public AccountEntity setMonthlySpend(BigDecimal monthlySpend) {
        this.monthlySpend = monthlySpend;
        return this;
    }

    public BigDecimal getReclaimable() {
        return reclaimable;
    }

    public AccountEntity setReclaimable(BigDecimal reclaimable) {
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
