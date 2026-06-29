package dev.cleat.worker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootTest(classes = CleatWorkerApplication.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ComponentScan(
        basePackages = "dev.cleat",
        excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "dev.cleat.api.*"))
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @Test
    void contextLoads() {}
}
