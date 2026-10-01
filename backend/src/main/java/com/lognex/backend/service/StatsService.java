package com.lognex.backend.service;

import com.lognex.backend.dto.LevelDistribution;
import com.lognex.backend.dto.ServerStats;
import com.lognex.backend.dto.StatsOverview;
import com.lognex.backend.dto.TimelineEntry;
import com.lognex.backend.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final LogRepository logRepository;

    public StatsOverview getOverview() {
        long totalLogs = logRepository.count();
        long errors = logRepository.countByLevel("ERROR");
        long warnings = logRepository.countByLevel("WARNING");
        long securityEvents = logRepository.countByLevel("SECURITY");
        
        long activeServers = logRepository.countDistinctServers();

        return StatsOverview.builder()
                .totalLogs(totalLogs)
                .errors(errors)
                .warnings(warnings)
                .securityEvents(securityEvents)
                .activeServers(activeServers)
                .build();
    }

    public List<TimelineEntry> getTimeline(String interval) {
        return new ArrayList<>(); 
    }

    public List<LevelDistribution> getLevelDistribution() {
        return logRepository.countByLevelGrouped();
    }

    public List<ServerStats> getServerStats() {
        return new ArrayList<>();
    }

    public List<LevelDistribution> getSourceStats() {
        return logRepository.countBySourceGrouped();
    }
}
