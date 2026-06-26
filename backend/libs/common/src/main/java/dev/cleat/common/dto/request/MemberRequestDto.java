package dev.cleat.common.dto.request;

import dev.cleat.common.enums.Role;
import java.util.List;

public class MemberRequestDto {

    private String login;
    private String name;
    private Role role;
    private Boolean twoFactor;
    private List<String> teams;

    public MemberRequestDto() {}

    public MemberRequestDto(String login, String name, Role role, Boolean twoFactor, List<String> team) {
        this.login = login;
        this.name = name;
        this.role = role;
        this.twoFactor = twoFactor;
        this.teams = team;
    }

    public String getLogin() {
        return login;
    }

    public MemberRequestDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public MemberRequestDto setName(String name) {
        this.name = name;
        return this;
    }

    public Role getRole() {
        return role;
    }

    public MemberRequestDto setRole(Role role) {
        this.role = role;
        return this;
    }

    public Boolean getTwoFactor() {
        return twoFactor;
    }

    public MemberRequestDto setTwoFactor(Boolean twoFactor) {
        this.twoFactor = twoFactor;
        return this;
    }

    public List<String> getTeams() {
        return teams;
    }

    public MemberRequestDto setTeams(List<String> teams) {
        this.teams = teams;
        return this;
    }
}
