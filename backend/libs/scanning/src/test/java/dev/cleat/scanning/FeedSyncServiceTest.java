package dev.cleat.scanning;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.cleat.common.enums.Reachable;
import dev.cleat.common.enums.Severity;
import dev.cleat.enrichment.dto.FeedResult;
import dev.cleat.enrichment.dto.OsvResponse;
import dev.cleat.enrichment.service.FeedService;
import dev.cleat.persistence.entity.VulnerabilityEntity;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import dev.cleat.scanning.service.FeedSyncService;
import dev.cleat.scanning.service.VulnerabilityUpdateService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

@ExtendWith(MockitoExtension.class)
public class FeedSyncServiceTest {

    @Mock
    VulnerabilityRepository vulnerabilityRepository;

    @Mock
    FeedService feedService;

    @Mock
    VulnerabilityUpdateService vulnerabilityUpdateService;

    @InjectMocks
    FeedSyncService feedSyncService;

    @Test
    void shouldRescoreAllVulnerabilities() {

        VulnerabilityEntity vulnerabilityEntity = new VulnerabilityEntity()
                .setCve("CVE-2025-1234")
                .setPackageName("spring-core")
                .setEcosystem("maven")
                .setCvss(9.5)
                .setSeverity(Severity.HIGH)
                .setReachable(Reachable.REACHABLE);

        FeedResult feed = new FeedResult(true, 0.95, new OsvResponse());
        Page<VulnerabilityEntity> page = new PageImpl<>(List.of(vulnerabilityEntity));

        when(vulnerabilityRepository.findAll(any(Pageable.class))).thenReturn(page);

        when(feedService.fetchFeeds(
                        vulnerabilityEntity.getCve(),
                        vulnerabilityEntity.getPackageName(),
                        vulnerabilityEntity.getEcosystem()))
                .thenReturn(feed);

        doNothing().when(vulnerabilityUpdateService).update(any(VulnerabilityEntity.class), any(FeedResult.class));

        feedSyncService.syncFeeds();

        verify(feedService)
                .fetchFeeds(
                        vulnerabilityEntity.getCve(),
                        vulnerabilityEntity.getPackageName(),
                        vulnerabilityEntity.getEcosystem());
        verify(vulnerabilityUpdateService).update(any(VulnerabilityEntity.class), any(FeedResult.class));
    }
}
