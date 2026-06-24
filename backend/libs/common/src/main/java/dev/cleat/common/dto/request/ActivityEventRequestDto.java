package dev.cleat.common.dto.request;

import dev.cleat.common.enums.EventCategory;
import dev.cleat.common.enums.Severity;

public class ActivityEventRequestDto {

    private String type;
    private Severity severity;
    private String actor;
    private String target;
    private String message;
    private EventCategory eventCategory;

    public ActivityEventRequestDto() {}

    public ActivityEventRequestDto(
            String type,
            Severity severity,
            String actor,
            String target,
            String repo,
            String message,
            EventCategory eventCategory) {

        this.type = type;
        this.severity = severity;
        this.actor = actor;
        this.target = target;
        this.message = message;
        this.eventCategory = eventCategory;
    }

    public String getType() {
        return type;
    }

    public ActivityEventRequestDto setType(String type) {
        this.type = type;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public ActivityEventRequestDto setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getActor() {
        return actor;
    }

    public ActivityEventRequestDto setActor(String actor) {
        this.actor = actor;
        return this;
    }

    public String getTarget() {
        return target;
    }

    public ActivityEventRequestDto setTarget(String target) {
        this.target = target;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ActivityEventRequestDto setMessage(String message) {
        this.message = message;
        return this;
    }

    public EventCategory getEventCategory() {
        return eventCategory;
    }

    public ActivityEventRequestDto setEventCategory(EventCategory eventCategory) {
        this.eventCategory = eventCategory;
        return this;
    }
}
