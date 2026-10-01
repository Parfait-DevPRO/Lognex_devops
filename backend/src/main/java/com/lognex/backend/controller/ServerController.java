package com.lognex.backend.controller;

import com.lognex.backend.dto.ServerStats;
import com.lognex.backend.service.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/servers")
@RequiredArgsConstructor
public class ServerController {
    private final ServerService serverService;

    @GetMapping
    public List<ServerStats> getAllServers() {
        return serverService.getAllServers();
    }

    @GetMapping("/{serverName}")
    public ServerStats getServerDetails(@PathVariable String serverName) {
        return serverService.getServerDetails(serverName);
    }
}
