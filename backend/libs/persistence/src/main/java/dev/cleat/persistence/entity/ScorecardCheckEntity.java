package dev.cleat.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "scorecard-check")
public class ScorecardCheckEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private Integer score;
    private String reason;

    public ScorecardCheckEntity() {}

    public ScorecardCheckEntity(UUID id, String name, Integer score, String reason) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.reason = reason;
    }

    public UUID getId() {
        return id;
    }

    public ScorecardCheckEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public ScorecardCheckEntity setName(String name) {
        this.name = name;
        return this;
    }

    public Integer getScore() {
        return score;
    }

    public ScorecardCheckEntity setScore(Integer score) {
        this.score = score;
        return this;
    }

    public String getReason() {
        return reason;
    }

    public ScorecardCheckEntity setReason(String reason) {
        this.reason = reason;
        return this;
    }
}
