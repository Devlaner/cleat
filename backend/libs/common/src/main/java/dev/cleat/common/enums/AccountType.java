package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AccountType {
    USER("user"),
    ORG("org");

    private final String value;

    AccountType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
