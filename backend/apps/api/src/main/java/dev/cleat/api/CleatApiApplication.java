package dev.cleat.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "dev.cleat")
public class CleatApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(CleatApiApplication.class);
    }
}
