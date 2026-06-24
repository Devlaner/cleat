package dev.cleat.common.dto;

import java.math.BigDecimal;

public class UsagePointDto {

    private String label;
    private Integer minutes;
    private Double storageGb;
    private BigDecimal cost;

    public String getLabel() {
        return label;
    }

    public UsagePointDto setLabel(String label) {
        this.label = label;
        return this;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public UsagePointDto setMinutes(Integer minutes) {
        this.minutes = minutes;
        return this;
    }

    public Double getStorageGb() {
        return storageGb;
    }

    public UsagePointDto setStorageGb(Double storageGb) {
        this.storageGb = storageGb;
        return this;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public UsagePointDto setCost(BigDecimal cost) {
        this.cost = cost;
        return this;
    }
}
