package dev.cleat.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootTest
@EntityScan(basePackages = "dev.cleat.persistence.entity")
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CleatApiTests extends AbstractIntegrationTest {

    @Test
    void contextLoad() {}
}
