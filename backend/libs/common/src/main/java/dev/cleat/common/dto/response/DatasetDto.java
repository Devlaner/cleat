package dev.cleat.common.dto.response;

import java.util.List;

public class DatasetDto {

    private AccountResponseDto account;
    private List<RepoResponseDto> repos;
    private List<SecretFindingResponseDto> secrets;
    private List<VulnerabilityResponseDto> vulnerabilities;
    private UsageResponseDto usage;
    private List<MemberResponseDto> members;
    private List<ActivityEventResponseDto> events;

    public DatasetDto() {}

    public DatasetDto(
            AccountResponseDto account,
            List<RepoResponseDto> repos,
            List<SecretFindingResponseDto> secrets,
            List<VulnerabilityResponseDto> vulnerabilities,
            UsageResponseDto usage,
            List<MemberResponseDto> members,
            List<ActivityEventResponseDto> events) {
        this.account = account;
        this.repos = repos;
        this.secrets = secrets;
        this.vulnerabilities = vulnerabilities;
        this.usage = usage;
        this.members = members;
        this.events = events;
    }

    public AccountResponseDto getAccount() {
        return account;
    }

    public DatasetDto setAccount(AccountResponseDto account) {
        this.account = account;
        return this;
    }

    public List<RepoResponseDto> getRepos() {
        return repos;
    }

    public DatasetDto setRepos(List<RepoResponseDto> repos) {
        this.repos = repos;
        return this;
    }

    public List<SecretFindingResponseDto> getSecrets() {
        return secrets;
    }

    public DatasetDto setSecrets(List<SecretFindingResponseDto> secrets) {
        this.secrets = secrets;
        return this;
    }

    public List<VulnerabilityResponseDto> getVulnerabilities() {
        return vulnerabilities;
    }

    public DatasetDto setVulnerabilities(List<VulnerabilityResponseDto> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
        return this;
    }

    public UsageResponseDto getUsage() {
        return usage;
    }

    public DatasetDto setUsage(UsageResponseDto usage) {
        this.usage = usage;
        return this;
    }

    public List<MemberResponseDto> getMembers() {
        return members;
    }

    public DatasetDto setMembers(List<MemberResponseDto> members) {
        this.members = members;
        return this;
    }

    public List<ActivityEventResponseDto> getEvents() {
        return events;
    }

    public DatasetDto setEvents(List<ActivityEventResponseDto> events) {
        this.events = events;
        return this;
    }
}
