package dev.cleat.scanning.service;

import dev.cleat.common.dto.request.CodeScanAlertRequestDto;
import dev.cleat.common.dto.response.CodeScanAlertResponseDto;
import dev.cleat.common.exception.NotFoundException;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.mapper.CodeScanAlertMapper;
import dev.cleat.persistence.repository.CodeScanAlertRepository;
import dev.cleat.persistence.repository.RepoRepository;
import dev.cleat.scanning.CodeScanAlertScanner;
import org.springframework.stereotype.Service;

@Service
public class CodeScanAlertService {

    private final CodeScanAlertMapper codeScanAlertMapper;
    private final CodeScanAlertScanner codeScanAlertScanner;
    private final CodeScanAlertRepository codeScanAlertRepository;
    private final RepoRepository repoRepository;

    public CodeScanAlertService(
            CodeScanAlertMapper codeScanAlertMapper,
            CodeScanAlertScanner codeScanAlertScanner,
            CodeScanAlertRepository codeScanAlertRepository,
            RepoRepository repoRepository) {
        this.codeScanAlertMapper = codeScanAlertMapper;
        this.codeScanAlertScanner = codeScanAlertScanner;
        this.codeScanAlertRepository = codeScanAlertRepository;
        this.repoRepository = repoRepository;
    }

    public CodeScanAlertResponseDto create(CodeScanAlertRequestDto codeScanAlertRequestDto) {
        CodeScanAlertEntity codeScanAlertEntity = codeScanAlertMapper.toCodeScanAlertEntity(codeScanAlertRequestDto);

        if (codeScanAlertEntity.getBranch() == null
                || codeScanAlertEntity.getBranch().isBlank()) {
            RepoEntity repoEntity = repoRepository
                    .findById(codeScanAlertRequestDto.getRepo())
                    .orElseThrow(() -> new NotFoundException("Repo not found"));

            codeScanAlertEntity.setBranch(repoEntity.getDefaultBranch());
        }
        codeScanAlertScanner.process(codeScanAlertEntity);

        CodeScanAlertEntity savedEntity = codeScanAlertRepository.save(codeScanAlertEntity);
        return codeScanAlertMapper.toCodeScanAlertDto(savedEntity);
    }
}
