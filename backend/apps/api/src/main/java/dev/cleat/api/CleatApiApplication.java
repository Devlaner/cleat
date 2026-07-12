package dev.cleat.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
        scanBasePackages = {
            "dev.cleat.api",
            "dev.cleat.persistence",
            "dev.cleat.domain",
            "dev.cleat.common",
            "dev.cleat.scanning",
            "dev.cleat.enrichment"
        })
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@EntityScan(basePackages = "dev.cleat.persistence.entity")
@EnableScheduling
public class CleatApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CleatApiApplication.class);
    }
}
