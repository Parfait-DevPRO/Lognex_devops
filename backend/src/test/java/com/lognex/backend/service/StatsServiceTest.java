package com.lognex.backend.service;

import com.lognex.backend.repository.LogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class StatsServiceTest {

    @Mock
    private LogRepository logRepository;
    
    @InjectMocks
    private StatsService statsService;

    @Test
    void testGetOverview() {
        assertNotNull(statsService);
    }
}
