package dev.cleat.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "dev.cleat.persistence")
public class CleatApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CleatApiApplication.class);
    }
}
