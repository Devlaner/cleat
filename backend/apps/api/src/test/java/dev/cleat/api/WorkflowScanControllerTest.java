package dev.cleat.api;

import static org.assertj.core.api.Assertions.assertThat;

import dev.cleat.common.enums.AccountType;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.WorkflowScanEntity;
import dev.cleat.persistence.repository.AccountRepository;
import dev.cleat.persistence.repository.RepoRepository;
import dev.cleat.persistence.repository.WorkflowScanRepository;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;

class WorkflowScanControllerTest extends AbstractIntegrationTest {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RepoRepository repoRepository;

    @Autowired
    private WorkflowScanRepository workflowScanRepository;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void returnsWorkflowScansForRepo() {
        // Arrange — DB-yə account, repo, scan yaz
        AccountEntity account =
                new AccountEntity().setLogin("octocat").setName("Octocat").setType(AccountType.USER);
        accountRepository.saveAndFlush(account);

        RepoEntity repo = new RepoEntity().setAccount(account).setName("hello-world");
        repoRepository.saveAndFlush(repo);

        workflowScanRepository.saveAndFlush(new WorkflowScanEntity()
                .setRepo(repo)
                .setWorkflowPath(".github/workflows/ci.yml")
                .setUnpinnedActions(2)
                .setBroadPermissions(false)
                .setMissingOidc(true)
                .setRiskScore(80)
                .setScannedAt(OffsetDateTime.now()));

        // Act — endpoint-ə sorğu at
        var response = restTemplate.getForEntity("/api/repos/" + repo.getId() + "/workflow-scans", List.class);

        // Assert
        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).hasSize(1);
    }

    @Test
    void returnsEmptyListWhenNoScans() {
        AccountEntity account =
                new AccountEntity().setLogin("octocat3").setName("Octocat3").setType(AccountType.USER);
        accountRepository.saveAndFlush(account);

        RepoEntity repo = new RepoEntity().setAccount(account).setName("empty-repo");
        repoRepository.saveAndFlush(repo);

        var response = restTemplate.getForEntity("/api/repos/" + repo.getId() + "/workflow-scans", List.class);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEmpty();
    }
}
