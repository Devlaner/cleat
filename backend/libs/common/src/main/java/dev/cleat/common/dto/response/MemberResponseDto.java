package dev.cleat.common.dto.response;

import dev.cleat.common.enums.Role;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class MemberResponseDto {
    private UUID id;
    private String login;
    private String name;
    private Role role;
    private Boolean twoFactor;
    private OffsetDateTime lastActiveAt;
    private List<String> teams;
    private Boolean outsideCollaborator;
    private Integer repoAccess;

    public UUID getId() {
        return id;
    }

    public MemberResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public MemberResponseDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public MemberResponseDto setName(String name) {
        this.name = name;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public MemberResponseDto setRole(Role role) {
        this.role = role;
        return this;
    }

    public Boolean getTwoFactor() {
        return twoFactor;
    }

    public MemberResponseDto setTwoFactor(Boolean twoFactor) {
        this.twoFactor = twoFactor;
        return this;
    }

    public OffsetDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public MemberResponseDto setLastActiveAt(OffsetDateTime lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
        return this;
    }

    public List<String> getTeams() {
        return teams;
    }

    public MemberResponseDto setTeams(List<String> teams) {
        this.teams = teams;
        return this;
    }

    public Boolean getOutsideCollaborator() {
        return outsideCollaborator;
    }

    public MemberResponseDto setOutsideCollaborator(Boolean outsideCollaborator) {
        this.outsideCollaborator = outsideCollaborator;
        return this;
    }

    public Integer getRepoAccess() {
        return repoAccess;
    }

    public MemberResponseDto setRepoAccess(Integer repoAccess) {
        this.repoAccess = repoAccess;
        return this;
    }
}
