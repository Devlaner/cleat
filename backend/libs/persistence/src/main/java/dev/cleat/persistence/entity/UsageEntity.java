package dev.cleat.persistence.entity;

import dev.cleat.common.dto.BreakdownItem;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "usage")
public class UsageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private Integer actionsMinutes;
    private Integer minutesIncluded;
    private Double storageGb;
    private Double storageIncludedGb;
    private BigDecimal monthlyCost;
    private BigDecimal reclaimable;

    @ElementCollection
    @CollectionTable(name = "usage_breakdown", joinColumns = @JoinColumn(name = "usage_id"))
    @Column(name = "breakdown")
    private List<BreakdownItem> breakdown;

    @OneToMany(mappedBy = "usage", cascade = CascadeType.ALL)
    private List<UsagePointEntity> series;

    public UsageEntity() {}

    public UsageEntity(
            UUID id,
            Integer actionsMinutes,
            Integer minutesIncluded,
            Double storageGb,
            Double storageIncludedGb,
            BigDecimal monthlyCost,
            BigDecimal reclaimable,
            List<BreakdownItem> breakdown,
            List<UsagePointEntity> series) {
        this.id = id;
        this.actionsMinutes = actionsMinutes;
        this.minutesIncluded = minutesIncluded;
        this.storageGb = storageGb;
        this.storageIncludedGb = storageIncludedGb;
        this.monthlyCost = monthlyCost;
        this.reclaimable = reclaimable;
        this.breakdown = breakdown;
        this.series = series;
    }

    public UUID getId() {
        return id;
    }

    public UsageEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public Integer getActionsMinutes() {
        return actionsMinutes;
    }

    public UsageEntity setActionsMinutes(Integer actionsMinutes) {
        this.actionsMinutes = actionsMinutes;
        return this;
    }

    public Integer getMinutesIncluded() {
        return minutesIncluded;
    }

    public UsageEntity setMinutesIncluded(Integer minutesIncluded) {
        this.minutesIncluded = minutesIncluded;
        return this;
    }

    public Double getStorageGb() {
        return storageGb;
    }

    public UsageEntity setStorageGb(Double storageGb) {
        this.storageGb = storageGb;
        return this;
    }

    public Double getStorageIncludedGb() {
        return storageIncludedGb;
    }

    public UsageEntity setStorageIncludedGb(Double storageIncludedGb) {
        this.storageIncludedGb = storageIncludedGb;
        return this;
    }

    public BigDecimal getMonthlyCost() {
        return monthlyCost;
    }

    public UsageEntity setMonthlyCost(BigDecimal monthlyCost) {
        this.monthlyCost = monthlyCost;
        return this;
    }

    public BigDecimal getReclaimable() {
        return reclaimable;
    }

    public UsageEntity setReclaimable(BigDecimal reclaimable) {
        this.reclaimable = reclaimable;
        return this;
    }

    public List<BreakdownItem> getBreakdown() {
        return breakdown;
    }

    public UsageEntity setBreakdown(List<BreakdownItem> breakdown) {
        this.breakdown = breakdown;
        return this;
    }

    public List<UsagePointEntity> getSeries() {
        return series;
    }

    public UsageEntity setSeries(List<UsagePointEntity> series) {
        this.series = series;
        return this;
    }
}
