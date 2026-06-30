package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.common.dto.response.SecretFindingResponseDto;
import dev.cleat.persistence.entity.SecretFindingEntity;
import org.springframework.stereotype.Component;

@Component
public class SecretFindingMapper {

    public SecretFindingResponseDto toSecretFindingDto(SecretFindingEntity secretFindingEntity) {
        return new SecretFindingResponseDto()
                .setId(secretFindingEntity.getId())
                .setAccountId(secretFindingEntity.getAccountId())
                .setRepo(
                        secretFindingEntity.getRepo() != null
                                ? secretFindingEntity.getRepo().getName()
                                : "Unknown")
                .setProvider(secretFindingEntity.getProvider())
                .setSecretType(secretFindingEntity.getSecretType())
                .setFile(secretFindingEntity.getFile())
                .setLine(secretFindingEntity.getLine())
                .setCommit(secretFindingEntity.getCommit())
                .setAuthor(secretFindingEntity.getAuthor())
                .setDetectedAt(secretFindingEntity.getDetectedAt())
                .setValidity(secretFindingEntity.getValidity())
                .setSeverity(secretFindingEntity.getSeverity())
                .setPushProtectionBlocked(secretFindingEntity.getPushProtectionBlocked());
    }

    public SecretFindingEntity toSecretFindingEntity(SecretFindingRequestDto secretFindingRequestDto) {
        if (secretFindingRequestDto == null) {
            return null;
        }
        return new SecretFindingEntity()
                .setAccountId(secretFindingRequestDto.getAccountId())
                .setProvider(secretFindingRequestDto.getProvider())
                .setSecretType(secretFindingRequestDto.getSecretType())
                .setFile(secretFindingRequestDto.getFile())
                .setLine(secretFindingRequestDto.getLine())
                .setCommit(secretFindingRequestDto.getCommit())
                .setAuthor(secretFindingRequestDto.getAuthor())
                .setDetectedAt(secretFindingRequestDto.getDetectedAt())
                .setValidity(secretFindingRequestDto.getValidity())
                .setSeverity(secretFindingRequestDto.getSeverity())
                .setPushProtectionBlocked(secretFindingRequestDto.getPushProtectionBlocked());
    }
}
