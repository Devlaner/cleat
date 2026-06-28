package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.response.UsageResponseDto;
import dev.cleat.persistence.entity.UsageEntity;
import org.springframework.stereotype.Component;

@Component
public class UsageMapper {

    private final UsagePointMapper usagePointMapper;

    public UsageMapper(UsagePointMapper usagePointMapper) {
        this.usagePointMapper = usagePointMapper;
    }

    public UsageResponseDto toUsageDto(UsageEntity usageEntity) {
        if (usageEntity == null) {
            return null;
        }
        return new UsageResponseDto()
                .setActionsMinutes(usageEntity.getActionsMinutes())
                .setMinutesIncluded(usageEntity.getMinutesIncluded())
                .setStorageGb(usageEntity.getStorageGb())
                .setStorageIncludedGb(usageEntity.getStorageIncludedGb())
                .setMonthlyCost(usageEntity.getMonthlyCost())
                .setReclaimable(usageEntity.getReclaimable())
                .setBreakdown(usageEntity.getBreakdown())
                .setSeries(usageEntity.getSeries().stream()
                        .map(usagePointMapper::toUsagePointDto)
                        .toList());
    }
}
