package dev.cleat.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import dev.cleat.common.enums.AccountType;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.WorkflowScanEntity;
import dev.cleat.persistence.repo.AccountRepository;
import dev.cleat.persistence.repo.RepoRepository;
import dev.cleat.persistence.repository.WorkflowScanRepository;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ContextConfiguration(classes = TestPersistenceConfig.class)
class WorkflowScanRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RepoRepository repoRepository;

    @Autowired
    private WorkflowScanRepository workflowScanRepository;

    @Test
    void savesAndFindsWorkflowScanByRepoId() {
        // Arrange
        AccountEntity account =
                new AccountEntity().setLogin("octocat").setName("Octocat").setType(AccountType.USER);
        accountRepository.saveAndFlush(account);

        RepoEntity repo = new RepoEntity().setAccount(account).setName("hello-world");
        repoRepository.saveAndFlush(repo);

        WorkflowScanEntity scan = new WorkflowScanEntity()
                .setRepo(repo)
                .setWorkflowPath(".github/workflows/ci.yml")
                .setUnpinnedActions(2)
                .setBroadPermissions(false)
                .setMissingOidc(true)
                .setRiskScore(80)
                .setScannedAt(OffsetDateTime.now());
        workflowScanRepository.saveAndFlush(scan);
        testEntityManager.clear();

        // Assert
        List<WorkflowScanEntity> results = workflowScanRepository.findByRepoIdOrderByScannedAtDesc(repo.getId());

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getWorkflowPath()).isEqualTo(".github/workflows/ci.yml");
        assertThat(results.get(0).getRiskScore()).isEqualTo(80);
        assertThat(results.get(0).getMissingOidc()).isTrue();
    }

    @Test
    void deleteByRepoIdRemovesAllScans() {
        AccountEntity account =
                new AccountEntity().setLogin("octocat2").setName("Octocat2").setType(AccountType.USER);
        accountRepository.saveAndFlush(account);

        RepoEntity repo = new RepoEntity().setAccount(account).setName("my-repo");
        repoRepository.saveAndFlush(repo);

        workflowScanRepository.saveAndFlush(new WorkflowScanEntity()
                .setRepo(repo)
                .setWorkflowPath(".github/workflows/ci.yml")
                .setUnpinnedActions(1)
                .setBroadPermissions(false)
                .setMissingOidc(false)
                .setRiskScore(30)
                .setScannedAt(OffsetDateTime.now()));

        workflowScanRepository.saveAndFlush(new WorkflowScanEntity()
                .setRepo(repo)
                .setWorkflowPath(".github/workflows/deploy.yml")
                .setUnpinnedActions(0)
                .setBroadPermissions(true)
                .setMissingOidc(true)
                .setRiskScore(60)
                .setScannedAt(OffsetDateTime.now()));

        testEntityManager.clear();

        // Act
        workflowScanRepository.deleteByRepoId(repo.getId());

        // Assert
        assertThat(workflowScanRepository.findByRepoIdOrderByScannedAtDesc(repo.getId()))
                .isEmpty();
    }
}
