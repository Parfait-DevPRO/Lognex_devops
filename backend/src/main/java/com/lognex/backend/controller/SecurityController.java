package com.lognex.backend.controller;

import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.dto.PageResponse;
import com.lognex.backend.dto.SecurityStats;
import com.lognex.backend.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
public class SecurityController {
    private final SecurityService securityService;

    @GetMapping("/events")
    public PageResponse<LogResponse> getSecurityEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return securityService.getSecurityEvents(page, size);
    }

    @GetMapping("/stats")
    public SecurityStats getSecurityStats() {
        return securityService.getSecurityStats();
    }
}
