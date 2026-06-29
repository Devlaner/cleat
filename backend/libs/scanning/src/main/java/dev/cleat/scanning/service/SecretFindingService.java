package dev.cleat.scanning.service;

import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.common.dto.response.SecretFindingResponseDto;
import dev.cleat.common.exception.NotFoundException;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.SecretFindingEntity;
import dev.cleat.persistence.mapper.SecretFindingMapper;
import dev.cleat.persistence.repository.RepoRepository;
import dev.cleat.scanning.SecretFindingScanner;
import org.springframework.stereotype.Service;

@Service
public class SecretFindingService {

    private final SecretFindingMapper secretFindingMapper;
    private final SecretFindingScanner secretScanner;
    private final RepoRepository repoRepository;

    public SecretFindingService(
            SecretFindingMapper secretFindingMapper,
            SecretFindingScanner secretScanner,
            RepoRepository repoRepository) {
        this.secretFindingMapper = secretFindingMapper;
        this.secretScanner = secretScanner;
        this.repoRepository = repoRepository;
    }

    public SecretFindingResponseDto create(SecretFindingRequestDto secretFindingRequestDto) {

        SecretFindingEntity secretFindingEntity = secretFindingMapper.toSecretFindingEntity(secretFindingRequestDto);
        RepoEntity repoEntity = repoRepository
                .findById(secretFindingRequestDto.getRepoId())
                .orElseThrow(() -> new NotFoundException("Repo not found"));
        secretFindingEntity.setAccountId(secretFindingRequestDto.getAccountId());
        secretFindingEntity.setRepo(repoEntity);
        secretScanner.process(secretFindingEntity);

        return secretFindingMapper.toSecretFindingDto(secretFindingEntity);
    }
}
