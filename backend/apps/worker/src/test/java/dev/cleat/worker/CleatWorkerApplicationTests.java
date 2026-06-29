package dev.cleat.worker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootTest(classes = CleatWorkerApplication.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@EnableJpaRepositories(basePackages = "dev.cleat")
@EntityScan(basePackages = "dev.cleat")
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {}
}
