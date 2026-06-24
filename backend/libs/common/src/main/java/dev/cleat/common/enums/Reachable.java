package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Reachable {
    REACHABLE("reachable"),
    NOT_REACHABLE("not-reachable"),
    UNKNOWN("unknown");

    private final String value;

    Reachable(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
