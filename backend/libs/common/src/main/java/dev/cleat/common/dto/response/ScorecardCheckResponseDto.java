package dev.cleat.common.dto.response;

import java.util.UUID;

public class ScorecardCheckResponseDto {
    private UUID id;
    private String name;
    private Integer score;
    private String reason;

    public UUID getId() {
        return id;
    }

    public ScorecardCheckResponseDto setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getReason() {
        return reason;
    }

    public ScorecardCheckResponseDto setReason(String reason) {
        this.reason = reason;
        return this;
    }

    public Integer getScore() {
        return score;
    }

    public ScorecardCheckResponseDto setScore(Integer score) {
        this.score = score;
        return this;
    }

    public String getName() {
        return name;
    }

    public ScorecardCheckResponseDto setName(String name) {
        this.name = name;
        return this;
    }
}
