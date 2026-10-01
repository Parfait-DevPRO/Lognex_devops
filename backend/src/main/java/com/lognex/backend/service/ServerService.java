package com.lognex.backend.service;

import com.lognex.backend.dto.ServerStats;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServerService {
    private final StatsService statsService;

    public List<ServerStats> getAllServers() {
        return statsService.getServerStats();
    }

    public ServerStats getServerDetails(String serverName) {
        return ServerStats.builder().server(serverName).build();
    }
}
