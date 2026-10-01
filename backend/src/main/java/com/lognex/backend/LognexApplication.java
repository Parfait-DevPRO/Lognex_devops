package com.lognex.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LognexApplication {
    public static void main(String[] args) {
        SpringApplication.run(LognexApplication.class, args);
        System.out.println("LognexApplication started successfully.");
    }
}
