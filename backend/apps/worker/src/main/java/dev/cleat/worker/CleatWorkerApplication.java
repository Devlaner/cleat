package dev.cleat.worker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
        scanBasePackages = {
            "dev.cleat.persistence",
            "dev.cleat.scanning",
            "dev.cleat.worker",
            "dev.cleat.domain",
            "dev.cleat.common"
        })
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@EntityScan(basePackages = "dev.cleat.persistence.entity")
@EnableScheduling
public class CleatWorkerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CleatWorkerApplication.class, args);
    }
}
