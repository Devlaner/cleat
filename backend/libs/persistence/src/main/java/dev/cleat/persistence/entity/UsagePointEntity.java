package dev.cleat.persistence.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "usage-point")
public class UsagePointEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String label;
    private Integer minutes;
    private Double storageGb;
    private BigDecimal cost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usage_id")
    private UsageEntity usage;

    public UsagePointEntity() {}

    public UsagePointEntity(
            UUID id, String label, Integer minutes, Double storageGb, BigDecimal cost, UsageEntity usage) {
        this.id = id;
        this.label = label;
        this.minutes = minutes;
        this.storageGb = storageGb;
        this.cost = cost;
        this.usage = usage;
    }

    public UUID getId() {
        return id;
    }

    public UsagePointEntity setId(UUID id) {
        this.id = id;
        return this;
    }

    public String getLabel() {
        return label;
    }

    public UsagePointEntity setLabel(String label) {
        this.label = label;
        return this;
    }

    public Integer getMinutes() {
        return minutes;
    }

    public UsagePointEntity setMinutes(Integer minutes) {
        this.minutes = minutes;
        return this;
    }

    public Double getStorageGb() {
        return storageGb;
    }

    public UsagePointEntity setStorageGb(Double storageGb) {
        this.storageGb = storageGb;
        return this;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public UsagePointEntity setCost(BigDecimal cost) {
        this.cost = cost;
        return this;
    }

    public UsageEntity getUsage() {
        return usage;
    }

    public UsagePointEntity setUsage(UsageEntity usage) {
        this.usage = usage;
        return this;
    }
}
