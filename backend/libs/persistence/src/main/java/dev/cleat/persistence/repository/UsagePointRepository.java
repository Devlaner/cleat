package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.UsagePointEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsagePointRepository extends JpaRepository<UsagePointEntity, UUID> {}
