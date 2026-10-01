package com.lognex.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "logs", indexes = {
        @Index(name = "idx_logs_timestamp", columnList = "timestamp"),
        @Index(name = "idx_logs_level", columnList = "level"),
        @Index(name = "idx_logs_server", columnList = "server"),
        @Index(name = "idx_logs_source", columnList = "source"),
        @Index(name = "idx_logs_ip_address", columnList = "ip_address"),
        @Index(name = "idx_logs_severity", columnList = "severity")
})
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private LocalDateTime timestamp;
    @Column(nullable = false, length = 32)
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
    @JdbcTypeCode(SqlTypes.JSON)
    @Column
    private Map<String, Object> metadata;
}
