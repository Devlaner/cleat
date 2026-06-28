package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.response.ScorecardCheckResponseDto;
import dev.cleat.persistence.entity.ScorecardCheckEntity;
import org.springframework.stereotype.Component;

@Component
public class ScorecardCheckMapper {

    public ScorecardCheckResponseDto toScorecardCheckResponseDto(ScorecardCheckEntity scorecardCheckEntity) {
        if (scorecardCheckEntity == null) {
            return null;
        }
        return new ScorecardCheckResponseDto()
                .setId(scorecardCheckEntity.getId())
                .setName(scorecardCheckEntity.getName())
                .setReason(scorecardCheckEntity.getReason())
                .setScore(scorecardCheckEntity.getScore());
    }
}
