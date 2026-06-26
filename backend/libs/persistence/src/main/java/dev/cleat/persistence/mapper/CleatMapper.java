package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.UsagePointDto;
import dev.cleat.common.dto.request.AccountRequestDto;
import dev.cleat.common.dto.request.ActivityEventRequestDto;
import dev.cleat.common.dto.request.MemberRequestDto;
import dev.cleat.common.dto.request.RepoRequestDto;
import dev.cleat.common.dto.request.SecretFindingRequestDto;
import dev.cleat.common.dto.request.VulnerabilityRequestDto;
import dev.cleat.common.dto.response.AccountResponseDto;
import dev.cleat.common.dto.response.ActivityEventResponseDto;
import dev.cleat.common.dto.response.DatasetDto;
import dev.cleat.common.dto.response.MemberResponseDto;
import dev.cleat.common.dto.response.RepoResponseDto;
import dev.cleat.common.dto.response.ScorecardCheckResponseDto;
import dev.cleat.common.dto.response.SecretFindingResponseDto;
import dev.cleat.common.dto.response.UsageResponseDto;
import dev.cleat.common.dto.response.VulnerabilityResponseDto;
import dev.cleat.persistence.entity.AccountEntity;
import dev.cleat.persistence.entity.ActivityEventEntity;
import dev.cleat.persistence.entity.MemberEntity;
import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.entity.ScorecardCheckEntity;
import dev.cleat.persistence.entity.SecretFindingEntity;
import dev.cleat.persistence.entity.UsageEntity;
import dev.cleat.persistence.entity.UsagePointEntity;
import dev.cleat.persistence.entity.VulnerabilityEntity;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CleatMapper {

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

    public RepoResponseDto toRepoDto(RepoEntity repoEntity) {
        if (repoEntity == null) {
            return null;
        }
        return new RepoResponseDto()
                .setId(repoEntity.getId())
                .setName(repoEntity.getName())
                .setAccountId(repoEntity.getAccount().getId())
                .setVisibility(repoEntity.getVisibility())
                .setLanguage(repoEntity.getLanguage())
                .setStars(repoEntity.getStars())
                .setDefaultBranch(repoEntity.getDefaultBranch())
                .setBranchProtected(repoEntity.getBranchProtected())
                .setHasReadme(repoEntity.getHasReadme())
                .setHasLicense(repoEntity.getHasLicense())
                .setHasContributing(repoEntity.getHasContributing())
                .setHasCodeowners(repoEntity.getHasCodeowners())
                .setHasCI(repoEntity.getHasCi())
                .setSizeMb(repoEntity.getSizeMb())
                .setLastPushedAt(repoEntity.getLastPushedAt())
                .setArchived(repoEntity.getArchived())
                .setOpenVulns(repoEntity.getOpenVulns())
                .setOpenSecrets(repoEntity.getOpenSecrets())
                .setOpenCodeAlerts(repoEntity.getOpenCodeAlerts())
                .setStaleBranches(repoEntity.getStaleBranches())
                .setOpenPRs(repoEntity.getOpenPRs())
                .setHygieneScore(repoEntity.getHygieneScore())
                .setScorecard((repoEntity.getScorecard())
                        .stream().map(this::toScorecardCheckResponseDto).toList())
                .setTopics(repoEntity.getTopics());
    }

    public RepoEntity toRepoEntity(RepoRequestDto repoRequestDto) {
        if (repoRequestDto == null) {
            return null;
        }
        return new RepoEntity()
                .setName(repoRequestDto.getName())
                .setVisibility(repoRequestDto.getVisibility())
                .setLanguage(repoRequestDto.getLanguage())
                .setDefaultBranch(repoRequestDto.getDefaultBranch())
                .setTopics(repoRequestDto.getTopics());
    }

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

    public DatasetDto toDatasetDto(
            AccountResponseDto account,
            List<RepoResponseDto> repos,
            List<SecretFindingResponseDto> secrets,
            List<VulnerabilityResponseDto> vulnerabilities,
            UsageResponseDto usage,
            List<MemberResponseDto> members,
            List<ActivityEventResponseDto> events) {
        return new DatasetDto()
                .setAccount(account)
                .setRepos(repos)
                .setSecrets(secrets)
                .setVulnerabilities(vulnerabilities)
                .setUsage(usage)
                .setMembers(members)
                .setEvents(events);
    }

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

    public SecretFindingResponseDto toSecretFindingDto(SecretFindingEntity secretFindingEntity) {
        return new SecretFindingResponseDto()
                .setId(secretFindingEntity.getId())
                .setAccountId(secretFindingEntity.getAccountId())
                .setRepo(secretFindingEntity.getRepo().getName())
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

    public VulnerabilityResponseDto toVulnerabilityDto(VulnerabilityEntity vulnerabilityEntity) {
        return new VulnerabilityResponseDto()
                .setId(vulnerabilityEntity.getId())
                .setAccountId(vulnerabilityEntity.getAccountId())
                .setPackageName(vulnerabilityEntity.getPackageName())
                .setEcosystem(vulnerabilityEntity.getEcosystem())
                .setCurrentVersion(vulnerabilityEntity.getCurrentVersion())
                .setFixedVersion(vulnerabilityEntity.getFixedVersion())
                .setCvss(vulnerabilityEntity.getCvss())
                .setSeverity(vulnerabilityEntity.getSeverity())
                .setEpss(vulnerabilityEntity.getEpss())
                .setKev(vulnerabilityEntity.getKev())
                .setReachable(vulnerabilityEntity.getReachable())
                .setAdvisoryId(vulnerabilityEntity.getAdvisoryId())
                .setCwe(vulnerabilityEntity.getCwe())
                .setTitle(vulnerabilityEntity.getTitle())
                .setAffectedRepos(vulnerabilityEntity.getAffectedRepos())
                .setHasFixPr(vulnerabilityEntity.getHasFixPr())
                .setPublishedAt(vulnerabilityEntity.getPublishedAt());
    }

    public VulnerabilityEntity toVulnerabilityEntity(VulnerabilityRequestDto vulnerabilityRequestDto) {
        if (vulnerabilityRequestDto == null) {
            return null;
        }
        return new VulnerabilityEntity()
                .setPackageName(vulnerabilityRequestDto.getPackageName())
                .setEcosystem(vulnerabilityRequestDto.getEcosystem())
                .setCurrentVersion(vulnerabilityRequestDto.getCurrentVersion())
                .setFixedVersion(vulnerabilityRequestDto.getFixedVersion())
                .setCvss(vulnerabilityRequestDto.getCvss())
                .setSeverity(vulnerabilityRequestDto.getSeverity())
                .setEpss(vulnerabilityRequestDto.getEpss())
                .setKev(vulnerabilityRequestDto.getKev())
                .setReachable(vulnerabilityRequestDto.getReachable())
                .setAdvisoryId(vulnerabilityRequestDto.getAdvisoryId())
                .setCwe(vulnerabilityRequestDto.getCwe())
                .setTitle(vulnerabilityRequestDto.getTitle())
                .setAffectedRepos(vulnerabilityRequestDto.getAffectedRepos())
                .setHasFixPr(vulnerabilityRequestDto.getHasFixPr());
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
                        .map(this::toUsagePointDto)
                        .toList());
    }

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
