package dev.cleat.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootTest(classes = CleatApiApplication.class, properties = "spring.main.allow-bean-definition-overriding=true")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ComponentScan(
        basePackages = "dev.cleat",
        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "dev.cleat.worker.*"))
public class CleatApiTests extends AbstractIntegrationTest {

    @Test
    void contextLoad() {}
}
