package dev.cleat.scanning;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.cleat.common.enums.Priority;
import dev.cleat.common.enums.Reachable;
import dev.cleat.common.enums.Severity;
import dev.cleat.domain.PriorityCalculator;
import dev.cleat.enrichment.dto.FeedResult;
import dev.cleat.enrichment.dto.OsvResponse;
import dev.cleat.enrichment.service.FeedService;
import dev.cleat.persistence.entity.VulnerabilityEntity;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import dev.cleat.scanning.service.FeedSyncService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class FeedSyncServiceTest {

    @Mock
    VulnerabilityRepository vulnerabilityRepository;

    @Mock
    FeedService feedService;

    @Mock
    PriorityCalculator priorityCalculator;

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

        when(vulnerabilityRepository.findAll()).thenReturn(List.of(vulnerabilityEntity));

        when(feedService.fetchFeeds(
                        vulnerabilityEntity.getCve(),
                        vulnerabilityEntity.getPackageName(),
                        vulnerabilityEntity.getEcosystem()))
                .thenReturn(feed);

        when(priorityCalculator.calculate(any())).thenReturn(Priority.URGENT);

        feedSyncService.syncFeeds();

        verify(vulnerabilityRepository).saveAll(any());

        assertEquals(true, vulnerabilityEntity.getKev());
        assertEquals(0.95, vulnerabilityEntity.getEpss());
        assertEquals(Priority.URGENT, vulnerabilityEntity.getPriority());
    }
}
