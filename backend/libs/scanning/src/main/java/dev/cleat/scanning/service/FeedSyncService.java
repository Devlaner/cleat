package dev.cleat.scanning.service;

import dev.cleat.domain.PriorityCalculator;
import dev.cleat.domain.model.Vulnerability;
import dev.cleat.enrichment.dto.FeedResult;
import dev.cleat.enrichment.service.FeedService;
import dev.cleat.persistence.entity.VulnerabilityEntity;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FeedSyncService {

    private final VulnerabilityRepository vulnerabilityRepository;

    private final PriorityCalculator priorityCalculator;

    private final FeedService feedService;

    public FeedSyncService(
            VulnerabilityRepository vulnerabilityRepository,
            FeedService feedService,
            PriorityCalculator priorityCalculator) {
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.feedService = feedService;
        this.priorityCalculator = priorityCalculator;
    }

    private static final Logger LOG = LoggerFactory.getLogger(FeedSyncService.class);

    @Transactional
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

                v.setKev(feed.kev());
                v.setEpss(feed.epss());

                if (feed.osv() != null && feed.osv().getSummary() != null) {
                    v.setTitle(feed.osv().getSummary());
                }
                Vulnerability vulnerability =
                        new Vulnerability(v.getKev(), v.getCvss(), v.getSeverity(), v.getEpss(), v.getReachable());
                v.setPriority(priorityCalculator.calculate(vulnerability));
                LOG.info("Updated vulnerability {}", v.getId());
            } catch (Exception e) {
                LOG.error("Failed to update vulnerability {}", v.getId(), e);
            }
        }
        vulnerabilityRepository.saveAll(vulnerabilities);
        LOG.info("Feed synchronization completed");
    }
}
