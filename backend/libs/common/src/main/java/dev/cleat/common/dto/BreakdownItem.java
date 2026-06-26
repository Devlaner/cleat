package dev.cleat.common.dto;

import jakarta.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public class BreakdownItem {

    private String label;
    private BigDecimal cost;
    private String hex;

    public String getLabel() {
        return label;
    }

    public BreakdownItem setLabel(String label) {
        this.label = label;
        return this;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public BreakdownItem setCost(BigDecimal cost) {
        this.cost = cost;
        return this;
    }

    public String getHex() {
        return hex;
    }

    public BreakdownItem setHex(String hex) {
        this.hex = hex;
        return this;
    }
}
