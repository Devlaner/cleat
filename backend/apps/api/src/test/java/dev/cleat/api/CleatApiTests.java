package dev.cleat.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = CleatApiApplication.class)
@ActiveProfiles("test")
public class CleatApiTests extends AbstractIntegrationTest {

    @Test
    void contextLoad() {}
}
