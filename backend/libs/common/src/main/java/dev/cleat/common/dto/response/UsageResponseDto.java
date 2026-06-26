package dev.cleat.common.dto.response;

import dev.cleat.common.dto.BreakdownItem;
import dev.cleat.common.dto.UsagePointDto;
import java.math.BigDecimal;
import java.util.List;

public class UsageResponseDto {

    private Integer actionsMinutes;
    private Integer minutesIncluded;
    private Double storageGb;
    private Double storageIncludedGb;
    private BigDecimal monthlyCost;
    private BigDecimal reclaimable;
    private List<BreakdownItem> breakdown;
    private List<UsagePointDto> series;

    public UsageResponseDto() {}

    public UsageResponseDto(
            Integer actionsMinutes,
            Integer minutesIncluded,
            Double storageGb,
            Double storageIncludedGb,
            BigDecimal monthlyCost,
            BigDecimal reclaimable,
            List<BreakdownItem> breakdown,
            List<UsagePointDto> series) {
        this.actionsMinutes = actionsMinutes;
        this.minutesIncluded = minutesIncluded;
        this.storageGb = storageGb;
        this.storageIncludedGb = storageIncludedGb;
        this.monthlyCost = monthlyCost;
        this.reclaimable = reclaimable;
        this.breakdown = breakdown;
        this.series = series;
    }

    public Integer getActionsMinutes() {
        return actionsMinutes;
    }

    public UsageResponseDto setActionsMinutes(Integer actionsMinutes) {
        this.actionsMinutes = actionsMinutes;
        return this;
    }

    public Integer getMinutesIncluded() {
        return minutesIncluded;
    }

    public UsageResponseDto setMinutesIncluded(Integer minutesIncluded) {
        this.minutesIncluded = minutesIncluded;
        return this;
    }

    public Double getStorageGb() {
        return storageGb;
    }

    public UsageResponseDto setStorageGb(Double storageGb) {
        this.storageGb = storageGb;
        return this;
    }

    public Double getStorageIncludedGb() {
        return storageIncludedGb;
    }

    public UsageResponseDto setStorageIncludedGb(Double storageIncludedGb) {
        this.storageIncludedGb = storageIncludedGb;
        return this;
    }

    public BigDecimal getMonthlyCost() {
        return monthlyCost;
    }

    public UsageResponseDto setMonthlyCost(BigDecimal monthlyCost) {
        this.monthlyCost = monthlyCost;
        return this;
    }

    public BigDecimal getReclaimable() {
        return reclaimable;
    }

    public UsageResponseDto setReclaimable(BigDecimal reclaimable) {
        this.reclaimable = reclaimable;
        return this;
    }

    public List<BreakdownItem> getBreakdown() {
        return breakdown;
    }

    public UsageResponseDto setBreakdown(List<BreakdownItem> breakdown) {
        this.breakdown = breakdown;
        return this;
    }

    public List<UsagePointDto> getSeries() {
        return series;
    }

    public UsageResponseDto setSeries(List<UsagePointDto> series) {
        this.series = series;
        return this;
    }
}
