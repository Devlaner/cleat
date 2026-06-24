package dev.cleat.common.dto.response;

import dev.cleat.common.enums.EventCategory;
import dev.cleat.common.enums.Severity;
import java.time.OffsetDateTime;
import java.util.UUID;

public class ActivityEventResponseDto {
    private UUID id;
    private UUID accountId;
    private String type;
    private Severity severity;
    private String actor;
    private String target;
    private String repo;
    private String message;
    private OffsetDateTime createdAt;
    private EventCategory eventCategory;

    public UUID getId() {
        return id;
    }

    public ActivityEventResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getAccountId() {
        return accountId;
    }

    public ActivityEventResponseDto setAccountId(UUID accountId) {
        this.accountId = accountId;
        return this;
    }

    public String getType() {
        return type;
    }

    public ActivityEventResponseDto setType(String type) {
        this.type = type;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public ActivityEventResponseDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getActor() {
        return actor;
    }

    public ActivityEventResponseDto setActor(String actor) {
        this.actor = actor;
        return this;
    }

    public String getTarget() {
        return target;
    }

    public ActivityEventResponseDto setTarget(String target) {
        this.target = target;
        return this;
    }

    public String getRepo() {
        return repo;
    }

    public ActivityEventResponseDto setRepo(String repo) {
        this.repo = repo;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ActivityEventResponseDto setMessage(String message) {
        this.message = message;
        return this;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public ActivityEventResponseDto setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public EventCategory getEventCategory() {
        return eventCategory;
    }

    public ActivityEventResponseDto setEventCategory(EventCategory eventCategory) {
        this.eventCategory = eventCategory;
        return this;
    }
}
