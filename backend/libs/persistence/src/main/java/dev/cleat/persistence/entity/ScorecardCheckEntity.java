package dev.cleat.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "scorecard_check")
public class ScorecardCheckEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private Integer score;
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo_id")
    private RepoEntity repo;

    public ScorecardCheckEntity() {}

    public ScorecardCheckEntity(UUID id, String name, Integer score, String reason, RepoEntity repo) {
        this.id = id;
        this.name = name;
        this.score = score;
        this.reason = reason;
        this.repo = repo;
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

    public RepoEntity getRepo() {
        return repo;
    }

    public ScorecardCheckEntity setRepo(RepoEntity repo) {
        this.repo = repo;
        return this;
    }
}
