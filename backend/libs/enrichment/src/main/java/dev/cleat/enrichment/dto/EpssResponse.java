package dev.cleat.enrichment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties()
public class EpssResponse {
    private List<EpssData> data;

    public List<EpssData> getData() {
        return data;
    }

    public EpssResponse setData(List<EpssData> data) {
        this.data = data;
        return this;
    }
}
