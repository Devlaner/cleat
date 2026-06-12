package dev.cleat.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "repo")
public class RepoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public RepoEntity() {}

    public RepoEntity(UUID id, AccountEntity account, Instant createdAt) {
        this.id = id;
        this.account = account;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public RepoEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public AccountEntity getAccount() {
        return account;
    }

    public RepoEntity setAccount(AccountEntity account) {
        this.account = account;
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public RepoEntity setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }
}
