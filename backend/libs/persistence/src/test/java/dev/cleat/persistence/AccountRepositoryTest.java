package dev.cleat.persistence;

import dev.cleat.common.enums.AccountType;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.repository.AccountRepository;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ContextConfiguration;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ContextConfiguration(classes = TestPersistenceConfig.class)
public class AccountRepositoryTest {

    @Autowired
    private TestEntityManager testEntityManager;

    @Autowired
    AccountRepository accountRepository;

    @Test
    void shouldSaveAccountWithRepos() {
        AccountEntity account =
                new AccountEntity().setLogin("test-user").setName("Test User").setType(AccountType.USER);

        RepoEntity repo = new RepoEntity().setName("test-repo").setAccount(account);

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
