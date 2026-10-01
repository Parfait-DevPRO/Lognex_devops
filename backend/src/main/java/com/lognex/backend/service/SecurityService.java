package com.lognex.backend.service;

import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.dto.PageResponse;
import com.lognex.backend.dto.SecurityStats;
import com.lognex.backend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {
    private final LogService logService;
    private final LogRepository logRepository;

    public PageResponse<LogResponse> getSecurityEvents(int page, int size) {
        return logService.searchLogs("SECURITY", null, null, null, null, null, null, null, null, page, size);
    }

    public SecurityStats getSecurityStats() {
        return SecurityStats.builder()
                .critical(logRepository.countByLevelAndSeverity("SECURITY", "CRITICAL"))
                .high(logRepository.countByLevelAndSeverity("SECURITY", "HIGH"))
                .medium(logRepository.countByLevelAndSeverity("SECURITY", "MEDIUM"))
                .low(logRepository.countByLevelAndSeverity("SECURITY", "LOW"))
                .build();
    }
}
