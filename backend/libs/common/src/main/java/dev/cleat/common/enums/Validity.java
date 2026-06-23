package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Validity {
    ACTIVE("active"),
    REVOKED("revoked"),
    UNKNOWN("unknown");

    private final String value;

    Validity(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
