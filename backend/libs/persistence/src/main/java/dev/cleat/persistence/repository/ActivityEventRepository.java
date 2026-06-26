package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.ActivityEventEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityEventRepository extends JpaRepository<ActivityEventEntity, UUID> {
    List<ActivityEventEntity> findAllByAccountId(UUID accountId);
}
