package com.lognex.backend.service;

import com.lognex.backend.dto.LogRequest;
import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.dto.PageResponse;
import com.lognex.backend.exception.ResourceNotFoundException;
import com.lognex.backend.model.Log;
import com.lognex.backend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogService {
    private final LogRepository logRepository;

    public LogResponse createLog(LogRequest request) {
        String level = request.getLevel().toUpperCase();
        String severity = request.getSeverity();
        
        if (severity == null || severity.trim().isEmpty()) {
            severity = determineSeverity(level, request.getHttpStatus());
        }

        Log log = Log.builder()
                .timestamp(request.getTimestamp() != null ? request.getTimestamp() : LocalDateTime.now())
                .level(level)
                .server(request.getServer())
                .source(request.getSource())
                .ipAddress(request.getIpAddress())
                .message(request.getMessage())
                .endpoint(request.getEndpoint())
                .httpMethod(request.getHttpMethod())
                .httpStatus(request.getHttpStatus())
                .requestId(request.getRequestId())
                .environment(request.getEnvironment())
                .severity(severity.toUpperCase())
                .metadata(request.getMetadata())
                .build();

        Log savedLog = logRepository.save(log);
        return mapToResponse(savedLog);
    }

    public PageResponse<LogResponse> getAllLogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<Log> logsPage = logRepository.findAll(pageable);
        return mapToPageResponse(logsPage);
    }

    public LogResponse getLogById(Long id) {
        Log log = logRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Log not found with id: " + id));
        return mapToResponse(log);
    }

    public void deleteLog(Long id) {
        if (!logRepository.existsById(id)) {
            throw new ResourceNotFoundException("Log not found with id: " + id);
        }
        logRepository.deleteById(id);
    }

    public PageResponse<LogResponse> searchLogs(String level, String server, String source, String ipAddress,
                                                String severity, String environment, String message,
                                                LocalDateTime from, LocalDateTime to, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<Log> logs = logRepository.search(
                emptyToNull(level), emptyToNull(server), emptyToNull(source), emptyToNull(ipAddress),
                emptyToNull(severity), emptyToNull(environment), emptyToNull(message), from, to, pageable);
        return PageResponse.<LogResponse>builder()
                .content(logs.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(logs.getNumber())
                .size(logs.getSize())
                .totalElements(logs.getTotalElements())
                .totalPages(logs.getTotalPages())
                .build();
    }

    private String emptyToNull(String value) {
        return value == null || value.isEmpty() ? null : value;
    }

    public List<LogResponse> getRecentLogs(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "timestamp"));
        return logRepository.findAll(pageable).getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public String determineSeverity(String level, Integer httpStatus) {
        if ("ERROR".equalsIgnoreCase(level)) {
            if (httpStatus != null && httpStatus >= 500) {
                return "HIGH";
            }
            return "MEDIUM";
        }
        if ("SECURITY".equalsIgnoreCase(level)) {
            return "HIGH";
        }
        if ("WARNING".equalsIgnoreCase(level)) {
            return "LOW";
        }
        return "LOW";
    }

    private LogResponse mapToResponse(Log log) {
        return LogResponse.builder()
                .id(log.getId())
                .timestamp(log.getTimestamp())
                .level(log.getLevel())
                .server(log.getServer())
                .source(log.getSource())
                .ipAddress(log.getIpAddress())
                .message(log.getMessage())
                .endpoint(log.getEndpoint())
                .httpMethod(log.getHttpMethod())
                .httpStatus(log.getHttpStatus())
                .requestId(log.getRequestId())
                .environment(log.getEnvironment())
                .severity(log.getSeverity())
                .metadata(log.getMetadata())
                .build();
    }

    private PageResponse<LogResponse> mapToPageResponse(Page<Log> page) {
        return PageResponse.<LogResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }
}
