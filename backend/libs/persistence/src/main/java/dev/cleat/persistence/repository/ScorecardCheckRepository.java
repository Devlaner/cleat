package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.ScorecardCheckEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScorecardCheckRepository extends JpaRepository<ScorecardCheckEntity, UUID> {}
