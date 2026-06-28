package dev.cleat.api.controller;

import dev.cleat.common.dto.request.CodeScanAlertRequestDto;
import dev.cleat.common.dto.response.CodeScanAlertResponseDto;
import dev.cleat.scanning.service.CodeScanAlertService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alerts")
public class CodeScanAlertController {

    private final CodeScanAlertService codeScanAlertService;

    public CodeScanAlertController(CodeScanAlertService codeScanAlertService) {
        this.codeScanAlertService = codeScanAlertService;
    }

    @PostMapping
    public ResponseEntity<CodeScanAlertResponseDto> create(
            @RequestBody CodeScanAlertRequestDto codeScanAlertRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(codeScanAlertService.create(codeScanAlertRequestDto));
    }
}
