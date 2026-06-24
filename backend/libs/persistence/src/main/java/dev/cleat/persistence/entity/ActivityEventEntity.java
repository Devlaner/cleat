package dev.cleat.persistence.entity;

import dev.cleat.common.enums.EventCategory;
import dev.cleat.common.enums.Severity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "activity_event")
public class ActivityEventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private AccountEntity account;

    @Column(name = "type")
    private String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private Severity severity;

    @Column(name = "actor")
    private String actor;

    @Column(name = "target")
    private String target;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repo")
    private RepoEntity repo;

    @Column(name = "message")
    private String message;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private EventCategory category;

    public ActivityEventEntity() {}

    public ActivityEventEntity(
            UUID id,
            AccountEntity account,
            String type,
            Severity severity,
            String actor,
            String target,
            RepoEntity repo,
            String message,
            OffsetDateTime createdAt,
            EventCategory category) {
        this.id = id;
        this.account = account;
        this.type = type;
        this.severity = severity;
        this.actor = actor;
        this.target = target;
        this.repo = repo;
        this.message = message;
        this.createdAt = createdAt;
        this.category = category;
    }

    public UUID getId() {
        return id;
    }

    public ActivityEventEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public AccountEntity getAccount() {
        return account;
    }

    public ActivityEventEntity setAccount(AccountEntity account) {
        this.account = account;
        return this;
    }

    public String getType() {
        return type;
    }

    public ActivityEventEntity setType(String type) {
        this.type = type;
        return this;
    }

    public Severity getSeverity() {
        return severity;
    }

    public ActivityEventEntity setSeverity(Severity severity) {
        this.severity = severity;
        return this;
    }

    public String getActor() {
        return actor;
    }

    public ActivityEventEntity setActor(String actor) {
        this.actor = actor;
        return this;
    }

    public String getTarget() {
        return target;
    }

    public ActivityEventEntity setTarget(String target) {
        this.target = target;
        return this;
    }

    public RepoEntity getRepo() {
        return repo;
    }

    public ActivityEventEntity setRepo(RepoEntity repo) {
        this.repo = repo;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public ActivityEventEntity setMessage(String message) {
        this.message = message;
        return this;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public ActivityEventEntity setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public EventCategory getCategory() {
        return category;
    }

    public ActivityEventEntity setCategory(EventCategory category) {
        this.category = category;
        return this;
    }
}
