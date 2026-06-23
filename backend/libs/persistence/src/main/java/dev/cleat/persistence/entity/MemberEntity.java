package dev.cleat.persistence.entity;

import dev.cleat.common.enums.Role;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "member")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "login")
    private String login;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "two_factor")
    private Boolean twoFactor;

    @Column(name = "last_active_at")
    private OffsetDateTime lastActiveAt;

    @ElementCollection
    @CollectionTable(name = "member_teams", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "teams")
    private List<String> teams;

    @Column(name = "outside_collaborator")
    private Boolean outsideCollaborator;

    @Column(name = "repo_access")
    private Integer repoAccess;

    public MemberEntity() {}

    public MemberEntity(
            UUID id,
            String login,
            String name,
            Role role,
            Boolean twoFactor,
            OffsetDateTime lastActiveAt,
            List<String> teams,
            Boolean outsideCollaborator,
            Integer repoAccess) {
        this.id = id;
        this.login = login;
        this.name = name;
        this.role = role;
        this.twoFactor = twoFactor;
        this.lastActiveAt = lastActiveAt;
        this.teams = teams;
        this.outsideCollaborator = outsideCollaborator;
        this.repoAccess = repoAccess;
    }

    public UUID getId() {
        return id;
    }

    public MemberEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getLogin() {
        return login;
    }

    public MemberEntity setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public MemberEntity setName(String name) {
        this.name = name;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public MemberEntity setRole(Role role) {
        this.role = role;
        return this;
    }

    public Boolean getTwoFactor() {
        return twoFactor;
    }

    public MemberEntity setTwoFactor(Boolean twoFactor) {
        this.twoFactor = twoFactor;
        return this;
    }

    public OffsetDateTime getLastActiveAt() {
        return lastActiveAt;
    }

    public MemberEntity setLastActiveAt(OffsetDateTime lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
        return this;
    }

    public List<String> getTeams() {
        return teams;
    }

    public MemberEntity setTeams(List<String> teams) {
        this.teams = teams;
        return this;
    }

    public Boolean getOutsideCollaborator() {
        return outsideCollaborator;
    }

    public MemberEntity setOutsideCollaborator(Boolean outsideCollaborator) {
        this.outsideCollaborator = outsideCollaborator;
        return this;
    }

    public Integer getRepoAccess() {
        return repoAccess;
    }

    public MemberEntity setRepoAccess(Integer repoAccess) {
        this.repoAccess = repoAccess;
        return this;
    }
}
