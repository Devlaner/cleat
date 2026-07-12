package dev.cleat.enrichment.client;

import dev.cleat.enrichment.dto.OsvPackage;
import dev.cleat.enrichment.dto.OsvRequest;
import dev.cleat.enrichment.dto.OsvResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OsvClient {
    private final RestTemplate restTemplate;

    public OsvClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private static final String URL = "https://api.osv.dev/v1/query";

    public OsvResponse query(String packageName, String ecosystem) {
        OsvPackage osvPackage = new OsvPackage().setName(packageName).setEcosystem(ecosystem);

        OsvRequest osvRequest = new OsvRequest().setPkg(osvPackage);

        return restTemplate.postForObject(URL, osvRequest, OsvResponse.class);
    }
}
