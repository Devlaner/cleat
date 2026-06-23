package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.SecretFindingEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SecretFindingRepository extends JpaRepository<SecretFindingEntity, UUID> {
    List<SecretFindingEntity> findAllByAccountId(UUID accountId);
}
