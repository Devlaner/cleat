package dev.cleat.worker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootTest(
        classes = CleatWorkerApplication.class,
        properties = "spring.main.allow-bean-definition-overriding=true")
@EntityScan(basePackages = "dev.cleat.persistence.entity")
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {}
}
