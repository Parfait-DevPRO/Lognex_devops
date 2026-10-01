package com.lognex.backend.controller;

import com.lognex.backend.service.LogService;
import com.lognex.backend.dto.LogResponse;
import com.lognex.backend.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LogController.class)
public class LogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LogService logService;

    @Test
    void testGetAllLogs_Returns200() throws Exception {
        mockMvc.perform(get("/api/logs"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLogById_Returns200() throws Exception {
        when(logService.getLogById(1L)).thenReturn(new LogResponse());
        mockMvc.perform(get("/api/logs/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetLogById_NotFound_Returns404() throws Exception {
        when(logService.getLogById(1L)).thenThrow(new ResourceNotFoundException("Not found"));
        mockMvc.perform(get("/api/logs/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateLog_ValidationError_Returns400() throws Exception {
        mockMvc.perform(post("/api/logs")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
