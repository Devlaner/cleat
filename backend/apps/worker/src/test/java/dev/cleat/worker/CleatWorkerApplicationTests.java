package dev.cleat.worker;

import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = CleatWorkerApplication.class)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {}

    @TestConfiguration
    static class TestConfig {
        @Primary
        @Bean
        public DataSource dataSource() {
            return DataSourceBuilder.create()
                    .url("jdbc:tc:postgresql:16-alpine:///cleat_db")
                    .driverClassName("org.testcontainers.jdbc.ContainerDatabaseDriver")
                    .build();
        }
    }
}
