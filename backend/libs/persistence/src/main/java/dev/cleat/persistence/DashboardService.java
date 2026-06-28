package dev.cleat.persistence;

import dev.cleat.common.dto.response.DatasetDto;
import dev.cleat.common.exception.NotFoundException;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.UsageEntity;
import dev.cleat.persistence.mapper.AccountMapper;
import dev.cleat.persistence.mapper.ActivityEventMapper;
import dev.cleat.persistence.mapper.CodeScanAlertMapper;
import dev.cleat.persistence.mapper.MemberMapper;
import dev.cleat.persistence.mapper.RepoMapper;
import dev.cleat.persistence.mapper.SecretFindingMapper;
import dev.cleat.persistence.mapper.UsageMapper;
import dev.cleat.persistence.mapper.VulnerabilityMapper;
import dev.cleat.persistence.repository.AccountRepository;
import dev.cleat.persistence.repository.ActivityEventRepository;
import dev.cleat.persistence.repository.CodeScanAlertRepository;
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
    private final AccountMapper accountMapper;
    private final ActivityEventMapper activityEventMapper;
    private final MemberMapper memberMapper;
    private final RepoMapper repoMapper;
    private final UsageMapper usageMapper;
    private final SecretFindingMapper secretFindingMapper;
    private final VulnerabilityMapper vulnerabilityMapper;
    private final CodeScanAlertMapper codeScanAlertMapper;
    private final CodeScanAlertRepository codeScanAlertRepository;

    public DashboardService(
            AccountRepository accountRepository,
            RepoRepository repoRepository,
            SecretFindingRepository secretFindingRepository,
            VulnerabilityRepository vulnerabilityRepository,
            UsageRepository usageRepository,
            MemberRepository memberRepository,
            ActivityEventRepository activityEventRepository,
            AccountMapper accountMapper,
            ActivityEventMapper activityEventMapper,
            MemberMapper memberMapper,
            RepoMapper repoMapper,
            UsageMapper usageMapper,
            SecretFindingMapper secretFindingMapper,
            VulnerabilityMapper vulnerabilityMapper,
            CodeScanAlertMapper codeScanAlertMapper,
            CodeScanAlertRepository codeScanAlertRepository) {
        this.accountRepository = accountRepository;
        this.repoRepository = repoRepository;
        this.secretFindingRepository = secretFindingRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.usageRepository = usageRepository;
        this.memberRepository = memberRepository;
        this.activityEventRepository = activityEventRepository;
        this.accountMapper = accountMapper;
        this.activityEventMapper = activityEventMapper;
        this.memberMapper = memberMapper;
        this.repoMapper = repoMapper;
        this.usageMapper = usageMapper;
        this.secretFindingMapper = secretFindingMapper;
        this.vulnerabilityMapper = vulnerabilityMapper;
        this.codeScanAlertMapper = codeScanAlertMapper;
        this.codeScanAlertRepository = codeScanAlertRepository;
    }

    @Transactional(readOnly = true)
    public DatasetDto getDataset(UUID accountId) {

        AccountEntity account =
                accountRepository.findById(accountId).orElseThrow(() -> new NotFoundException("Account not found"));
        return new DatasetDto(
                accountMapper.toAccountDto(account),
                repoRepository.findAllByAccountId(accountId).stream()
                        .map(repoMapper::toRepoDto)
                        .toList(),
                secretFindingRepository.findAllByAccountId(accountId).stream()
                        .map(secretFindingMapper::toSecretFindingDto)
                        .toList(),
                vulnerabilityRepository.findAllByAccountId(accountId).stream()
                        .map(vulnerabilityMapper::toVulnerabilityDto)
                        .toList(),
                codeScanAlertRepository.findAllByAccountId(accountId).stream()
                        .map(codeScanAlertMapper::toCodeScanAlertDto)
                        .toList(),
                usageMapper.toUsageDto(
                        usageRepository.findByAccountId(accountId).orElse(new UsageEntity())),
                memberRepository.findAllByAccountId(accountId).stream()
                        .map(memberMapper::toMemberDto)
                        .toList(),
                activityEventRepository.findAllByAccountId(accountId).stream()
                        .map(activityEventMapper::toActivityEventDto)
                        .toList());
    }
}
