package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.AccountRequestDto;
import dev.cleat.common.dto.response.AccountResponseDto;
import dev.cleat.persistence.entity.AccountEntity;
import org.springframework.stereotype.Component;

@Component
public class AccountMapper {
    public AccountResponseDto toAccountDto(AccountEntity accountEntity) {
        if (accountEntity == null) {
            return null;
        }

        return new AccountResponseDto()
                .setId(accountEntity.getId())
                .setLogin(accountEntity.getLogin())
                .setName(accountEntity.getName())
                .setType(accountEntity.getType())
                .setPlan(accountEntity.getPlan())
                .setRepoCount(accountEntity.getRepoCount())
                .setMemberCount(accountEntity.getMemberCount())
                .setPostureScore(accountEntity.getPostureScore())
                .setMonthlySpend(accountEntity.getMonthlySpend())
                .setReclaimable(accountEntity.getReclaimable());
    }

    public AccountEntity toAccountEntity(AccountRequestDto accountRequestDto) {
        if (accountRequestDto == null) {
            return null;
        }
        return new AccountEntity()
                .setLogin(accountRequestDto.getLogin())
                .setName(accountRequestDto.getName())
                .setType(accountRequestDto.getType())
                .setPlan(accountRequestDto.getPlan());
    }
}
