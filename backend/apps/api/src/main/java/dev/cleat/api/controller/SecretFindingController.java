package dev.cleat.api.controller;

import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.common.dto.response.SecretFindingResponseDto;
import dev.cleat.scanning.service.SecretFindingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/secrets")
public class SecretFindingController {

    private final SecretFindingService secretFindingService;

    public SecretFindingController(SecretFindingService secretFindingService) {
        this.secretFindingService = secretFindingService;
    }

    @PostMapping
    public ResponseEntity<SecretFindingResponseDto> createSecret(
            @RequestBody SecretFindingRequestDto secretFindingRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(secretFindingService.create(secretFindingRequestDto));
    }
}
