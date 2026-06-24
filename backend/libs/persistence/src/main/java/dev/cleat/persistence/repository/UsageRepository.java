package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.UsageEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsageRepository extends JpaRepository<UsageEntity, UUID> {
    Optional<UsageEntity> findByAccountId(UUID accountId);
}
