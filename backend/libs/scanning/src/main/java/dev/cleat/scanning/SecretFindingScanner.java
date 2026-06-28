package dev.cleat.scanning;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Validity;
import dev.cleat.persistence.entity.SecretFindingEntity;
import dev.cleat.persistence.repository.SecretFindingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SecretFindingScanner {
    private static final Logger log = LoggerFactory.getLogger(SecretFindingScanner.class);
    private final SecretFindingRepository secretFindingRepository;

    public SecretFindingScanner(SecretFindingRepository secretFindingRepository) {
        this.secretFindingRepository = secretFindingRepository;
    }

    public void process(SecretFindingEntity secretFindingEntity) {
        log.info(
                "Processing secret finding for repo: {}",
                secretFindingEntity.getRepo().getName());
        if (Boolean.FALSE.equals(secretFindingEntity.getPushProtectionBlocked())) {
            secretFindingEntity.setSeverity(Severity.CRITICAL).setValidity(Validity.ACTIVE);
        } else {
            secretFindingEntity.setSeverity(Severity.LOW).setValidity(Validity.REVOKED);
        }
        secretFindingRepository.save(secretFindingEntity);
        log.info("Secret finding processed successfully: {}", secretFindingEntity.getId());
    }
}
