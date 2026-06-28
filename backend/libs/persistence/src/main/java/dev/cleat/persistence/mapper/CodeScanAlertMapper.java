package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.CodeScanAlertRequestDto;
import dev.cleat.common.dto.response.CodeScanAlertResponseDto;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import org.springframework.stereotype.Component;

@Component
public class CodeScanAlertMapper {

    public CodeScanAlertResponseDto toCodeScanAlertDto(CodeScanAlertEntity codeScanAlertEntity) {

        if (codeScanAlertEntity == null) {
            return null;
        }
        return new CodeScanAlertResponseDto(
                codeScanAlertEntity.getId(),
                codeScanAlertEntity.getAccountId(),
                codeScanAlertEntity.getRepo(),
                codeScanAlertEntity.getRule(),
                codeScanAlertEntity.getRuleId(),
                codeScanAlertEntity.getSeverity(),
                codeScanAlertEntity.getFile(),
                codeScanAlertEntity.getLine(),
                codeScanAlertEntity.getBranch(),
                codeScanAlertEntity.getStatus(),
                codeScanAlertEntity.getTool(),
                codeScanAlertEntity.getDetectedAt(),
                codeScanAlertEntity.getDescription());
    }

    public CodeScanAlertEntity toCodeScanAlertEntity(CodeScanAlertRequestDto codeScanAlertRequestDto) {

        if (codeScanAlertRequestDto == null) {
            return null;
        }

        return new CodeScanAlertEntity()
                .setAccountId(codeScanAlertRequestDto.getAccountId())
                .setRepo(codeScanAlertRequestDto.getRepo())
                .setRule(codeScanAlertRequestDto.getRule())
                .setRuleId(codeScanAlertRequestDto.getRuleId())
                .setSeverity(codeScanAlertRequestDto.getSeverity())
                .setFile(codeScanAlertRequestDto.getFile())
                .setLine(codeScanAlertRequestDto.getLine())
                .setBranch(codeScanAlertRequestDto.getBranch())
                .setTool(codeScanAlertRequestDto.getTool())
                .setDescription(codeScanAlertRequestDto.getDescription());
    }
}
