package dev.cleat.persistence;

import java.util.List;
import org.junit.jupiter.api.Assertions;
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
public class AccountRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Autowired
    private TestEntityManager testEntityManager;

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    AccountRepository accountRepository;

    @Test
    void shouldSaveAccountWithRepos() {
        AccountEntity account = new AccountEntity()
                .setLogin("test-user")
                .setName("Test User")
                .setType("USER")
                .setPlan("FREE");

        RepoEntity repo =
                new RepoEntity().setName("test-repo").setVisibility("PUBLIC").setAccount(account);

        account.setRepos(List.of(repo));
        repo.setAccount(account);
        accountRepository.saveAndFlush(account);
        testEntityManager.clear();
        AccountEntity found = accountRepository.findById(account.getId()).orElseThrow();

        Assertions.assertNotNull(found.getId());
        Assertions.assertEquals(1, found.getRepos().size());
        Assertions.assertEquals("test-repo", found.getRepos().getFirst().getName());
    }
}
