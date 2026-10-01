package com.lognex.backend.dto;

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
public class LogResponse {
    private Long id;
    private LocalDateTime timestamp;
    private String level;
    private String server;
    private String source;
    private String ipAddress;
    private String message;
    private String endpoint;
    private String httpMethod;
    private Integer httpStatus;
    private String requestId;
    private String environment;
    private String severity;
    private Map<String, Object> metadata;
}
