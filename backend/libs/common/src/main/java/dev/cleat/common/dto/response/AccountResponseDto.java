package dev.cleat.common.dto.response;

import dev.cleat.common.enums.AccountType;
import dev.cleat.common.enums.Plan;
import java.math.BigDecimal;
import java.util.UUID;

public class AccountResponseDto {
    private UUID id;
    private String login;
    private String name;
    private AccountType type;
    private Plan plan;
    private Integer repoCount;
    private Integer memberCount;
    private Integer postureScore;
    private BigDecimal monthlySpend;
    private BigDecimal reclaimable;

    public UUID getId() {
        return id;
    }

    public AccountResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public AccountResponseDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public AccountResponseDto setName(String name) {
        this.name = name;
        return this;
    }

    public AccountType getType() {
        return type;
    }

    public AccountResponseDto setType(AccountType type) {
        this.type = type;
        return this;
    }

    public Plan getPlan() {
        return plan;
    }

    public AccountResponseDto setPlan(Plan plan) {
        this.plan = plan;
        return this;
    }

    public Integer getRepoCount() {
        return repoCount;
    }

    public AccountResponseDto setRepoCount(Integer repoCount) {
        this.repoCount = repoCount;
        return this;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public AccountResponseDto setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
        return this;
    }

    public Integer getPostureScore() {
        return postureScore;
    }

    public AccountResponseDto setPostureScore(Integer postureScore) {
        this.postureScore = postureScore;
        return this;
    }

    public BigDecimal getMonthlySpend() {
        return monthlySpend;
    }

    public AccountResponseDto setMonthlySpend(BigDecimal monthlySpend) {
        this.monthlySpend = monthlySpend;
        return this;
    }

    public BigDecimal getReclaimable() {
        return reclaimable;
    }

    public AccountResponseDto setReclaimable(BigDecimal reclaimable) {
        this.reclaimable = reclaimable;
        return this;
    }
}
