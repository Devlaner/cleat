package dev.cleat.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(
        classes = {CleatApiApplication.class},
        webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@TestPropertySource(
        properties = {
            "spring.main.allow-bean-definition-overriding=true",
            "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
        })
public class CleatApiTests extends AbstractIntegrationTest {

    @Test
    void contextLoad() {}
}
