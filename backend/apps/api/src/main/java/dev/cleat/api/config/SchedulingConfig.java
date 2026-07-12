package dev.cleat.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class SchedulingConfig {

    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler schedular = new ThreadPoolTaskScheduler();
        schedular.setPoolSize(4);
        schedular.setThreadNamePrefix("scheduler-");
        schedular.initialize();
        return schedular;
    }
}
