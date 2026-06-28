package dev.cleat.worker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"dev.cleat.persistence", "dev.cleat.scanning", "dev.cleat.worker"})
@EnableScheduling
public class CleatWorkerApplication {

    public static void main(String[] args) {
        SpringApplication.run(CleatWorkerApplication.class, args);
    }
}
