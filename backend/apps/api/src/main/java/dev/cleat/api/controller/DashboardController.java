package dev.cleat.api.controller;

import dev.cleat.common.dto.response.DatasetDto;
import dev.cleat.persistence.DashboardService;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dataset")
    public ResponseEntity<DatasetDto> getDashboardData(@RequestHeader("X-Account-Id") UUID accountId) {
        return ResponseEntity.ok(dashboardService.getDataset(accountId));
    }
}
