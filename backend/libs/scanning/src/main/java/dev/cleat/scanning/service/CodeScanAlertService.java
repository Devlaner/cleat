package dev.cleat.scanning.service;

import dev.cleat.common.dto.request.CodeScanAlertRequestDto;
import dev.cleat.common.dto.response.CodeScanAlertResponseDto;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import dev.cleat.persistence.mapper.CodeScanAlertMapper;
import dev.cleat.scanning.CodeScanAlertScanner;
import org.springframework.stereotype.Service;

@Service
public class CodeScanAlertService {

    private final CodeScanAlertMapper codeScanAlertMapper;
    private final CodeScanAlertScanner codeScanAlertScanner;

    public CodeScanAlertService(CodeScanAlertMapper codeScanAlertMapper, CodeScanAlertScanner codeScanAlertScanner) {
        this.codeScanAlertMapper = codeScanAlertMapper;
        this.codeScanAlertScanner = codeScanAlertScanner;
    }

    public CodeScanAlertResponseDto create(CodeScanAlertRequestDto codeScanAlertRequestDto) {
        CodeScanAlertEntity codeScanAlertEntity = codeScanAlertMapper.toCodeScanAlertEntity(codeScanAlertRequestDto);

        codeScanAlertScanner.process(codeScanAlertEntity);

        return codeScanAlertMapper.toCodeScanAlertDto(codeScanAlertEntity);
    }
}
