package dev.cleat.enrichment.service;

import dev.cleat.common.exception.FeedSyncException;
import dev.cleat.enrichment.client.EpssClient;
import dev.cleat.enrichment.client.KevClient;
import dev.cleat.enrichment.client.OsvClient;
import dev.cleat.enrichment.dto.FeedResult;
import dev.cleat.enrichment.dto.OsvResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FeedService {
    private final KevClient kevClient;
    private final EpssClient epssClient;
    private final OsvClient osvClient;

    public FeedService(KevClient kevClient, EpssClient epssClient, OsvClient osvClient) {
        this.kevClient = kevClient;
        this.epssClient = epssClient;
        this.osvClient = osvClient;
    }

    private static final Logger LOG = LoggerFactory.getLogger(FeedService.class);

    public boolean isKev(String cve) {
        return kevClient.isKev(cve);
    }

    public Double fetchScore(String cve) {
        return epssClient.fetchScore(cve);
    }

    public OsvResponse query(String packageName, String ecosystem) {
        return osvClient.query(packageName, ecosystem);
    }

    public dev.cleat.enrichment.dto.FeedResult fetchFeeds(String cve, String packageName, String ecosystem) {

        LOG.info("Fetching feeds for CVE: {}", cve);
        try {
            FeedResult result = new FeedResult(
                    kevClient.isKev(cve), epssClient.fetchScore(cve), osvClient.query(packageName, ecosystem));
            LOG.info("Successfully fetched feeds for CVE: {}", cve);
            return result;
        } catch (Exception e) {
            LOG.error("Failed to fetch feeds for {}", cve, e);
            throw new FeedSyncException("Failed to fetch enrichment feeds", e);
        }
    }
}
