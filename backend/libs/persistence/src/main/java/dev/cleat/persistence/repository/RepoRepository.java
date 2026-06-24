package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.RepoEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepoRepository extends JpaRepository<RepoEntity, UUID> {
    List<RepoEntity> findAllByAccountId(UUID accountId);
}
