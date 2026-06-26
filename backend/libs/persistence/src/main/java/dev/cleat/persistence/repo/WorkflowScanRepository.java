package dev.cleat.persistence.repo;

import dev.cleat.persistence.entity.WorkflowScanEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowScanRepository extends JpaRepository<WorkflowScanEntity, UUID> {

    List<WorkflowScanEntity> findByRepoIdOrderByScannedAtDesc(UUID repoId);

    void deleteByRepoId(UUID repoId);
}
