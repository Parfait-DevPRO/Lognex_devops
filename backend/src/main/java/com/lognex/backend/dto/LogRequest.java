package com.lognex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogRequest {
    private LocalDateTime timestamp;
    
    @NotBlank(message = "Level is required")
    private String level;
    
    @NotBlank(message = "Server is required")
    private String server;
    
    @NotBlank(message = "Source is required")
    private String source;
    
    private String ipAddress;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    private String endpoint;
    private String httpMethod;
    private Integer httpStatus;
    private String requestId;
    private String environment;
    private String severity;
    private Map<String, Object> metadata;
}
