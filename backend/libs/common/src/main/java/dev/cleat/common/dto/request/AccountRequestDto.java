package dev.cleat.common.dto.request;

import dev.cleat.common.enums.AccountType;
import dev.cleat.common.enums.Plan;

public class AccountRequestDto {

    private String login;
    private String name;
    private AccountType type;
    private Plan plan;

    public String getLogin() {
        return login;
    }

    public AccountRequestDto setLogin(String login) {
        this.login = login;
        return this;
    }

    public String getName() {
        return name;
    }

    public AccountRequestDto setName(String name) {
        this.name = name;
        return this;
    }

    public AccountType getType() {
        return type;
    }

    public AccountRequestDto setType(AccountType type) {
        this.type = type;
        return this;
    }

    public Plan getPlan() {
        return plan;
    }

    public AccountRequestDto setPlan(Plan plan) {
        this.plan = plan;
        return this;
    }
}
