package com.lognex.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServerStats {
    private String server;
    private long count;
    private String lastActivity;
    private List<String> environments;
    private Map<String, Long> levels;
}
