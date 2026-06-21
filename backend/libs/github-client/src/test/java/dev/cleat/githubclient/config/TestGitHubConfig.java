package dev.cleat.githubclient.config;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@ComponentScan(basePackages = "dev.cleat.githubclient")
public class TestGitHubConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder().build();
    }
}