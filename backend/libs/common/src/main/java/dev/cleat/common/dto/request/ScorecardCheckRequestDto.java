package dev.cleat.common.dto.request;

public class ScorecardCheckRequestDto {
    private String name;
    private Integer score;
    private String reason;

    public ScorecardCheckRequestDto() {}

    public ScorecardCheckRequestDto(String name, Integer score, String reason) {
        this.name = name;
        this.score = score;
        this.reason = reason;
    }

    public String getName() {
        return name;
    }

    public ScorecardCheckRequestDto setName(String name) {
        this.name = name;
        return this;
    }

    public Integer getScore() {
        return score;
    }

    public ScorecardCheckRequestDto setScore(Integer score) {
        this.score = score;
        return this;
    }

    public String getReason() {
        return reason;
    }

    public ScorecardCheckRequestDto setReason(String reason) {
        this.reason = reason;
        return this;
    }
}
