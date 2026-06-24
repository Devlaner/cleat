package dev.cleat.persistence;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "dev.cleat.persistence")
@EntityScan(basePackages = "dev.cleat.persistence")
public class TestPersistenceConfig {}
