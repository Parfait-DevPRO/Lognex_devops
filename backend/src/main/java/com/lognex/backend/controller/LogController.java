package com.lognex.backend.controller;

import com.lognex.backend.dto.LogRequest;
import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.dto.PageResponse;
import com.lognex.backend.service.LogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {
    private final LogService logService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LogResponse createLog(@Valid @RequestBody LogRequest request) {
        return logService.createLog(request);
    }

    @GetMapping
    public PageResponse<LogResponse> getAllLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return logService.getAllLogs(page, size);
    }

    @GetMapping("/{id}")
    public LogResponse getLogById(@PathVariable Long id) {
        return logService.getLogById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLog(@PathVariable Long id) {
        logService.deleteLog(id);
    }

    @GetMapping("/search")
    public PageResponse<LogResponse> searchLogs(
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String server,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String ipAddress,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String environment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return logService.searchLogs(level, server, source, ipAddress, severity, environment, message, from, to, page, size);
    }

    @GetMapping("/recent")
    public List<LogResponse> getRecentLogs(@RequestParam(defaultValue = "50") int limit) {
        return logService.getRecentLogs(limit);
    }
}
