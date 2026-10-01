package com.lognex.backend.controller;

import com.lognex.backend.dto.LevelDistribution;
import com.lognex.backend.dto.ServerStats;
import com.lognex.backend.dto.StatsOverview;
import com.lognex.backend.dto.TimelineEntry;
import com.lognex.backend.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {
    private final StatsService statsService;

    @GetMapping("/overview")
    public StatsOverview getOverview() {
        return statsService.getOverview();
    }

    @GetMapping("/timeline")
    public List<TimelineEntry> getTimeline(@RequestParam(defaultValue = "hour") String interval) {
        return statsService.getTimeline(interval);
    }

    @GetMapping("/levels")
    public List<LevelDistribution> getLevelDistribution() {
        return statsService.getLevelDistribution();
    }

    @GetMapping("/servers")
    public List<ServerStats> getServerStats() {
        return statsService.getServerStats();
    }

    @GetMapping("/sources")
    public List<LevelDistribution> getSourceStats() {
        return statsService.getSourceStats();
    }
}
