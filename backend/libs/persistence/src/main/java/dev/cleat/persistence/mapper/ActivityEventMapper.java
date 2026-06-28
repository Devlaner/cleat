package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.ActivityEventRequestDto;
import dev.cleat.common.dto.response.ActivityEventResponseDto;
import dev.cleat.persistence.entity.ActivityEventEntity;
import org.springframework.stereotype.Component;

@Component
public class ActivityEventMapper {

    public ActivityEventResponseDto toActivityEventDto(ActivityEventEntity activityEventEntity) {
        if (activityEventEntity == null) {
            return null;
        }
        return new ActivityEventResponseDto()
                .setId(activityEventEntity.getId())
                .setAccountId(activityEventEntity.getAccountId())
                .setType(activityEventEntity.getType())
                .setSeverity(activityEventEntity.getSeverity())
                .setActor(activityEventEntity.getActor())
                .setTarget(activityEventEntity.getTarget())
                .setRepo(activityEventEntity.getRepo().getName())
                .setMessage(activityEventEntity.getMessage())
                .setCreatedAt(activityEventEntity.getCreatedAt());
    }

    public ActivityEventEntity toActiveEventEntity(ActivityEventRequestDto activityEventRequestDto) {
        if (activityEventRequestDto == null) {
            return null;
        }
        return new ActivityEventEntity()
                .setType(activityEventRequestDto.getType())
                .setSeverity(activityEventRequestDto.getSeverity())
                .setActor(activityEventRequestDto.getActor())
                .setTarget(activityEventRequestDto.getTarget())
                .setMessage(activityEventRequestDto.getMessage());
    }
}
