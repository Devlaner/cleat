package dev.cleat.worker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(
        classes = {CleatWorkerApplication.class},
        webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@TestPropertySource(
        properties = {
            "spring.main.allow-bean-definition-overriding=true",
            "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
        })
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {}
}
