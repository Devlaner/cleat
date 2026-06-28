package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.CodeScanAlertEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeScanAlertRepository extends JpaRepository<CodeScanAlertEntity, UUID> {

    List<CodeScanAlertEntity> findAllByAccountId(UUID accountId);
}
