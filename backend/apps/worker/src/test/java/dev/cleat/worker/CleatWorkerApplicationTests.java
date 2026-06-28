package dev.cleat.worker;

import dev.cleat.scanning.VulnerabilityScanner;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(classes = CleatWorkerApplication.class)
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @MockitoBean
    private VulnerabilityScanner vulnerabilityScanner;

    @Test
    void contextLoads() {}
}
