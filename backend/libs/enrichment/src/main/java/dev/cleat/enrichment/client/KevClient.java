package dev.cleat.enrichment.client;

import dev.cleat.enrichment.dto.KevResponse;
import dev.cleat.enrichment.dto.KevVulnerability;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KevClient {
    private final RestTemplate restTemplate;
    private Set<String> kevCache;
    private Long cacheTimestamp;
    private static final long CACHE_TTL_MS = 3600_000L;

    public KevClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String URL =
            "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

    public synchronized Set<String> getKevCache() {

        if (kevCache == null || System.currentTimeMillis() - cacheTimestamp > CACHE_TTL_MS) {
            KevResponse response = restTemplate.getForObject(URL, KevResponse.class);
            kevCache = (response == null || response.getVulnerabilities() == null)
                    ? Set.of()
                    : response.getVulnerabilities().stream()
                            .map(KevVulnerability::getCveId)
                            .collect(Collectors.toSet());
            cacheTimestamp = System.currentTimeMillis();
        }
        return kevCache;
    }

    public boolean isKev(String cve) {
        return getKevCache().contains(cve);
    }

    public KevResponse fetchFeed() {
        return restTemplate.getForObject(URL, KevResponse.class);
    }
}
