package dev.cleat.enrichment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class KevResponse {
    private List<KevVulnerability> vulnerabilities;

    public List<KevVulnerability> getVulnerabilities() {
        return vulnerabilities;
    }

    public KevResponse setVulnerabilities(List<KevVulnerability> vulnerabilities) {
        this.vulnerabilities = vulnerabilities;
        return this;
    }
}
