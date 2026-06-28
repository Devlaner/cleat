package dev.cleat.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"dev.cleat"})
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@EntityScan(basePackages = "dev.cleat.persistence.entity")
public class CleatApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CleatApiApplication.class);
    }
}
