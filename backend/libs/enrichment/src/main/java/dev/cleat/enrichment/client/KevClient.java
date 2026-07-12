package dev.cleat.enrichment.client;

import dev.cleat.enrichment.dto.KevResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KevClient {
    private final RestTemplate restTemplate;

    public KevClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String URL =
            "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";

    public boolean isKev(String cve) {
        KevResponse response = restTemplate.getForObject(URL, KevResponse.class);
        if (response == null || response.getVulnerabilities() == null) {
            return false;
        }
        return response.getVulnerabilities().stream().anyMatch(v -> cve.equals(v.getCveId()));
    }

    public KevResponse fetchFeed() {
        return restTemplate.getForObject(URL, KevResponse.class);
    }
}
