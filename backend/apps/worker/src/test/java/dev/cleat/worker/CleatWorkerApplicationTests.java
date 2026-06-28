package dev.cleat.worker;

import dev.cleat.domain.PriorityCalculator;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import dev.cleat.scanning.VulnerabilityScanner;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
        classes = CleatWorkerApplication.class,
        properties = {
            "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
                    + ",org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
        })
public class CleatWorkerApplicationTests extends AbstractIntegrationTest {

    @MockitoBean
    private VulnerabilityScanner vulnerabilityScanner;

    @MockitoBean
    private PriorityCalculator priorityCalculator;

    @MockitoBean
    private VulnerabilityRepository vulnerabilityRepository;

    @Test
    void contextLoads() {}
}
