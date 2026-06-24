package dev.cleat.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum EventCategory {
    SECURITY("security"),
    ACCESS("access"),
    SUPPLY_CHAIN("supply-chain"),
    MAINTENANCE("maintenance");

    private final String value;

    EventCategory(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
