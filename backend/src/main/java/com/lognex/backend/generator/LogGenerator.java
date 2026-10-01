package com.lognex.backend.generator;

import com.lognex.backend.model.Log;
import com.lognex.backend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@Profile("demo")
@RequiredArgsConstructor
public class LogGenerator {
    private final LogRepository logRepository;
    private final Random random = new Random();

    private final List<String> servers = Arrays.asList("server-prod-01", "server-prod-02", "server-api-01", "server-api-02", "server-db-01", "server-web-01");
    private final List<String> sources = Arrays.asList("Spring Boot", "Nginx", "PostgreSQL", "Redis", "Kafka", "Auth Service");
    private final List<String> levels = Arrays.asList("INFO", "INFO", "INFO", "INFO", "INFO", "WARNING", "WARNING", "ERROR", "SECURITY", "DEBUG");
    private final List<String> endpoints = Arrays.asList("/api/users", "/api/logs", "/api/auth/login", "/api/orders", "/api/products", "/api/health");
    private final List<String> methods = Arrays.asList("GET", "GET", "GET", "POST", "PUT", "DELETE");
    private final List<String> environments = Arrays.asList("production", "staging", "development");

    @Scheduled(fixedRateString = "${lognex.generator.rate:1000}")
    public void generateLog() {
        String level = levels.get(random.nextInt(levels.size()));
        Integer httpStatus = level.equals("ERROR") ? 500 : 200;
        
        Log log = Log.builder()
                .timestamp(LocalDateTime.now())
                .level(level)
                .server(servers.get(random.nextInt(servers.size())))
                .source(sources.get(random.nextInt(sources.size())))
                .ipAddress("192.168.1." + random.nextInt(255))
                .message("Generated log message for " + level)
                .endpoint(endpoints.get(random.nextInt(endpoints.size())))
                .httpMethod(methods.get(random.nextInt(methods.size())))
                .httpStatus(httpStatus)
                .environment(environments.get(random.nextInt(environments.size())))
                .severity(level.equals("ERROR") ? "HIGH" : "LOW")
                .build();
                
        logRepository.save(log);
    }
}
