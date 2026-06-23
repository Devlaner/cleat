package dev.cleat.persistence.repository;

import dev.cleat.persistence.entity.MemberEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<MemberEntity, UUID> {
    List<MemberEntity> findAllByAccountId(UUID accountId);
}
