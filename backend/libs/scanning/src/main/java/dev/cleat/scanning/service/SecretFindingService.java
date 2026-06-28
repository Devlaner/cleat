package dev.cleat.scanning.service;

import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.common.dto.response.SecretFindingResponseDto;
import dev.cleat.persistence.entity.SecretFindingEntity;
import dev.cleat.persistence.mapper.SecretFindingMapper;
import dev.cleat.scanning.SecretFindingScanner;
import org.springframework.stereotype.Service;

@Service
public class SecretFindingService {

    private final SecretFindingMapper secretFindingMapper;
    private final SecretFindingScanner secretScanner;

    public SecretFindingService(SecretFindingMapper secretFindingMapper, SecretFindingScanner secretScanner) {
        this.secretFindingMapper = secretFindingMapper;
        this.secretScanner = secretScanner;
    }

    public SecretFindingResponseDto create(SecretFindingRequestDto secretFindingRequestDto) {

        SecretFindingEntity secretFindingEntity = secretFindingMapper.toSecretFindingEntity(secretFindingRequestDto);

        secretScanner.process(secretFindingEntity);

        return secretFindingMapper.toSecretFindingDto(secretFindingEntity);
    }
}
