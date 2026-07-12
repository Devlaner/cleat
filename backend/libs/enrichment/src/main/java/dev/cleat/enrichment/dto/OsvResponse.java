package dev.cleat.enrichment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class OsvResponse {

    private String id;
    private String summary;

    public String getId() {
        return id;
    }

    public OsvResponse setId(String id) {
        this.id = id;
        return this;
    }

    public String getSummary() {
        return summary;
    }

    public OsvResponse setSummary(String summary) {
        this.summary = summary;
        return this;
    }
}
