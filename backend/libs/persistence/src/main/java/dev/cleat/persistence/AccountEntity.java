package dev.cleat.persistence;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "account")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RepoEntity> repos = new ArrayList<>();

    public AccountEntity(UUID id, Instant createdAt, List<RepoEntity> repos) {
        this.id = id;
        this.createdAt = createdAt;
        this.repos = repos;
    }

    public AccountEntity() {}

    public UUID getId() {
        return id;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<RepoEntity> getRepos() {
        return repos;
    }

    public AccountEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public AccountEntity setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public AccountEntity setRepos(List<RepoEntity> repos) {
        this.repos = repos;
        return this;
    }
}
