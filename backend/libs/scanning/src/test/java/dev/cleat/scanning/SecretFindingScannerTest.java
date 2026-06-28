package dev.cleat.scanning;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Validity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.SecretFindingEntity;
import dev.cleat.persistence.repository.SecretFindingRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SecretFindingScannerTest {

    @InjectMocks
    private SecretFindingScanner secretFindingScanner;

    @Mock
    private SecretFindingRepository secretFindingRepository;

    @Test
    void givenSecretNotBlockedByPushProtection_whenProcessing_thenSeverityShouldBeCritical() {

        // given
        SecretFindingEntity secretFindingEntity = new SecretFindingEntity().setPushProtectionBlocked(false);
        RepoEntity repoEntity = new RepoEntity().setName("test-repo");
        secretFindingEntity.setRepo(repoEntity);
        // when
        secretFindingScanner.process(secretFindingEntity);

        // then
        Assertions.assertEquals(Severity.CRITICAL, secretFindingEntity.getSeverity());
        Assertions.assertEquals(Validity.ACTIVE, secretFindingEntity.getValidity());
        verify(secretFindingRepository).save(any());
    }

    @Test
    void givenSecretBlockedByPushProtection_whenProcessing_thenSeverityShouldBeLow() {

        // given
        SecretFindingEntity secretFindingEntity = new SecretFindingEntity().setPushProtectionBlocked(true);
        RepoEntity repoEntity = new RepoEntity().setName("test-repo");
        secretFindingEntity.setRepo(repoEntity);

        // when
        secretFindingScanner.process(secretFindingEntity);

        // then
        Assertions.assertEquals(Severity.LOW, secretFindingEntity.getSeverity());
        Assertions.assertEquals(Validity.REVOKED, secretFindingEntity.getValidity());
        verify(secretFindingRepository).save(any());
    }
}
