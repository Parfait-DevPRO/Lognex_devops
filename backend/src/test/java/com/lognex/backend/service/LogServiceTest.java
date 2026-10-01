package com.lognex.backend.service;

import com.lognex.backend.dto.LogRequest;
import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.exception.ResourceNotFoundException;
import com.lognex.backend.model.Log;
import com.lognex.backend.repository.LogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class LogServiceTest {

    @Mock
    private LogRepository logRepository;
    
    @InjectMocks
    private LogService logService;

    @Test
    void testCreateLog_Success() {
        LogRequest req = new LogRequest();
        req.setLevel("INFO");
        req.setServer("srv1");
        
        Log savedLog = new Log();
        savedLog.setId(1L);
        savedLog.setLevel("INFO");
        
        when(logRepository.save(any(Log.class))).thenReturn(savedLog);
        
        LogResponse res = logService.createLog(req);
        assertEquals("INFO", res.getLevel());
        assertEquals(1L, res.getId());
    }

    @Test
    void testGetLogById_Found() {
        Log log = new Log();
        log.setId(1L);
        when(logRepository.findById(1L)).thenReturn(Optional.of(log));
        
        LogResponse res = logService.getLogById(1L);
        assertEquals(1L, res.getId());
    }

    @Test
    void testGetLogById_NotFound() {
        when(logRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> logService.getLogById(1L));
    }

    @Test
    void testDetermineSeverity() {
        assertEquals("HIGH", logService.determineSeverity("ERROR", 500));
        assertEquals("MEDIUM", logService.determineSeverity("ERROR", 400));
        assertEquals("HIGH", logService.determineSeverity("SECURITY", 200));
        assertEquals("LOW", logService.determineSeverity("WARNING", 200));
    }
}
