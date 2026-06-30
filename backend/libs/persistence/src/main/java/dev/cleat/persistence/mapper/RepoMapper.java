package dev.cleat.persistence.mapper;

import dev.cleat.common.dto.request.RepoRequestDto;
import dev.cleat.common.dto.response.RepoResponseDto;
import dev.cleat.persistence.entity.RepoEntity;
import org.springframework.stereotype.Component;

@Component
public class RepoMapper {

    private final ScorecardCheckMapper scorecardCheckMapper;

    public RepoMapper(ScorecardCheckMapper scorecardCheckMapper) {
        this.scorecardCheckMapper = scorecardCheckMapper;
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
                        .stream()
                                .map(scorecardCheckMapper::toScorecardCheckResponseDto)
                                .toList())
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
}
