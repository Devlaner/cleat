package dev.cleat.enrichment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EpssData {
    private String cve;
    private Double epss;

    public String getCve() {
        return cve;
    }

    public EpssData setCve(String cve) {
        this.cve = cve;
        return this;
    }

    public Double getEpss() {
        return epss;
    }

    public EpssData setEpss(Double epss) {
        this.epss = epss;
        return this;
    }
}
