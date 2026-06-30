package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Priority {
    URGENT("urgent"),
    HIGH("high"),
    MEDIUM("medium"),
    LOW("low");

    private final String value;

    Priority(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
