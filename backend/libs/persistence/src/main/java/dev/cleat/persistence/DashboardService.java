package dev.cleat.persistence;

import dev.cleat.common.dto.response.DatasetDto;
import dev.cleat.common.exception.NotFoundException;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.UsageEntity;
import dev.cleat.persistence.mapper.CleatMapper;
import dev.cleat.persistence.repository.AccountRepository;
import dev.cleat.persistence.repository.ActivityEventRepository;
import dev.cleat.persistence.repository.MemberRepository;
import dev.cleat.persistence.repository.RepoRepository;
import dev.cleat.persistence.repository.SecretFindingRepository;
import dev.cleat.persistence.repository.UsageRepository;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {
    private final AccountRepository accountRepository;
    private final RepoRepository repoRepository;
    private final SecretFindingRepository secretFindingRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final UsageRepository usageRepository;
    private final MemberRepository memberRepository;
    private final ActivityEventRepository activityEventRepository;
    private final CleatMapper cleatMapper;

    public DashboardService(
            AccountRepository accountRepository,
            RepoRepository repoRepository,
            SecretFindingRepository secretFindingRepository,
            VulnerabilityRepository vulnerabilityRepository,
            UsageRepository usageRepository,
            MemberRepository memberRepository,
            ActivityEventRepository activityEventRepository,
            CleatMapper cleatMapper) {
        this.accountRepository = accountRepository;
        this.repoRepository = repoRepository;
        this.secretFindingRepository = secretFindingRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.usageRepository = usageRepository;
        this.memberRepository = memberRepository;
        this.activityEventRepository = activityEventRepository;
        this.cleatMapper = cleatMapper;
    }

    @Transactional(readOnly = true)
    public DatasetDto getDataset(UUID accountId) {

        AccountEntity account =
                accountRepository.findById(accountId).orElseThrow(() -> new NotFoundException("Account not found"));
        return new DatasetDto(
                cleatMapper.toAccountDto(account),
                repoRepository.findAllByAccountId(accountId).stream()
                        .map(cleatMapper::toRepoDto)
                        .toList(),
                secretFindingRepository.findAllByAccountId(accountId).stream()
                        .map(cleatMapper::toSecretFindingDto)
                        .toList(),
                vulnerabilityRepository.findAllByAccountId(accountId).stream()
                        .map(cleatMapper::toVulnerabilityDto)
                        .toList(),
                cleatMapper.toUsageDto(
                        usageRepository.findByAccountId(accountId).orElse(new UsageEntity())),
                memberRepository.findAllByAccountId(accountId).stream()
                        .map(cleatMapper::toMemberDto)
                        .toList(),
                activityEventRepository.findAllByAccountId(accountId).stream()
                        .map(cleatMapper::toActivityEventDto)
                        .toList());
    }
}
