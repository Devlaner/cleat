package dev.cleat.worker;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@ComponentScan(basePackages = "dev.cleat.worker")
@EnableJpaRepositories(basePackages = "dev.cleat.persistence.repository")
@EntityScan(basePackages = "dev.cleat.persistence.entity")
public class TestWorkerConfig {}
