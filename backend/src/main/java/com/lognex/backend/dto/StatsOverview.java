package com.lognex.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsOverview {
    private long totalLogs;
    private long errors;
    private long warnings;
    private long securityEvents;
    private long activeServers;
}
