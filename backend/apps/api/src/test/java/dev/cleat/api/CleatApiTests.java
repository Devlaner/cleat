package dev.cleat.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        properties = {"spring.datasource.url=", "spring.flyway.enabled=false", "spring.jpa.hibernate.ddl-auto=none"})
public class CleatApiTests {

    @Test
    void contextLoad() {}
}
