package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.UsagePointDto;
import dev.cleat.persistence.entity.UsagePointEntity;
import org.springframework.stereotype.Component;

@Component
public class UsagePointMapper {

    public UsagePointDto toUsagePointDto(UsagePointEntity usagePointEntity) {
        if (usagePointEntity == null) {
            return null;
        }
        return new UsagePointDto()
                .setLabel(usagePointEntity.getLabel())
                .setMinutes(usagePointEntity.getMinutes())
                .setStorageGb(usagePointEntity.getStorageGb())
                .setCost(usagePointEntity.getCost());
    }
}
