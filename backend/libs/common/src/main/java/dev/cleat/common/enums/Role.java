package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    OWNER("owner"),
    ADMIN("admin"),
    MEMBER("member");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
