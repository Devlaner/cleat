package dev.cleat.scanning.service;

import dev.cleat.enrichment.dto.FeedResult;
import dev.cleat.enrichment.service.FeedService;
import dev.cleat.persistence.entity.VulnerabilityEntity;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class FeedSyncService {

    private final VulnerabilityRepository vulnerabilityRepository;
    private final FeedService feedService;
    private final VulnerabilityUpdateService vulnerabilityUpdateService;

    public FeedSyncService(
            VulnerabilityRepository vulnerabilityRepository,
            FeedService feedService,
            VulnerabilityUpdateService vulnerabilityUpdateService) {
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.feedService = feedService;
        this.vulnerabilityUpdateService = vulnerabilityUpdateService;
    }

    private static final Logger LOG = LoggerFactory.getLogger(FeedSyncService.class);

    @Scheduled(fixedDelayString = "${feed.sync.delay}")
    public void syncFeeds() {
        LOG.info("Feed synchronization started");
        List<VulnerabilityEntity> vulnerabilities = vulnerabilityRepository.findAll();
        for (VulnerabilityEntity v : vulnerabilities) {
            if (v.getCve() == null) {
                LOG.warn("Skipping vulnerability {} because CVE is missing", v.getId());
                continue;
            }
            try {
                FeedResult feed = feedService.fetchFeeds(v.getCve(), v.getPackageName(), v.getEcosystem());
                vulnerabilityUpdateService.update(v, feed);
                LOG.info("Updated vulnerability {}", v.getId());
            } catch (Exception e) {
                LOG.error("Failed to update vulnerability {}", v.getId(), e);
            }
        }
        LOG.info("Feed synchronization completed");
    }
}
