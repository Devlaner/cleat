package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Plan {
    FREE("Free"),
    TEAM("Team"),
    ENTERPRISE("Enterprise");

    private final String value;

    Plan(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
