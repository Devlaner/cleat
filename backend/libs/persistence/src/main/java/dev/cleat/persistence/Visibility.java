package dev.cleat.persistence;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Visibility {
    PUBLIC("public"),
    PRIVATE("private"),
    INTERNAL("internal");
    private final String value;

    Visibility(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
