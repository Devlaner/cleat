package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.MemberRequestDto;
import dev.cleat.common.dto.response.MemberResponseDto;
import dev.cleat.persistence.entity.MemberEntity;
import org.springframework.stereotype.Component;

@Component
public class MemberMapper {

    public MemberResponseDto toMemberDto(MemberEntity memberEntity) {
        return new MemberResponseDto()
                .setId(memberEntity.getId())
                .setLogin(memberEntity.getLogin())
                .setName(memberEntity.getName())
                .setRole(memberEntity.getRole())
                .setTwoFactor(memberEntity.getTwoFactor())
                .setLastActiveAt(memberEntity.getLastActiveAt())
                .setTeams(memberEntity.getTeams())
                .setOutsideCollaborator(memberEntity.getOutsideCollaborator())
                .setRepoAccess(memberEntity.getRepoAccess());
    }

    public MemberEntity toMemberEntity(MemberRequestDto memberRequestDto) {
        if (memberRequestDto == null) {
            return null;
        }
        return new MemberEntity()
                .setLogin(memberRequestDto.getLogin())
                .setName(memberRequestDto.getName())
                .setRole(memberRequestDto.getRole())
                .setTwoFactor(memberRequestDto.getTwoFactor())
                .setTeams(memberRequestDto.getTeams());
    }
}
