package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    OPEN("open"),
    FIXED("fixed"),
    DISMISSED("dismissed");

    private final String value;

    Status(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
