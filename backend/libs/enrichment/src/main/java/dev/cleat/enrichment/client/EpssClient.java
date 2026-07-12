package dev.cleat.enrichment.client;

import dev.cleat.enrichment.dto.EpssResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class EpssClient {
    private final RestTemplate restTemplate;

    public EpssClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String URL = "https://api.first.org/data/v1/epss?cve=";

    public Double fetchScore(String cve) {

        EpssResponse response = restTemplate.getForObject(URL + cve, EpssResponse.class);
        if (response == null || response.getData() == null || response.getData().isEmpty()) {
            return null;
        }
        return response.getData().getFirst().getEpss();
    }

    public EpssResponse fetchFeed(String cve) {
        return restTemplate.getForObject(URL + cve, EpssResponse.class);
    }
}
