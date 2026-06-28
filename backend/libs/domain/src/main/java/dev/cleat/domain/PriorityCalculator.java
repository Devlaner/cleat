package dev.cleat.domain;

import dev.cleat.common.enums.Priority;
import dev.cleat.domain.model.Vulnerability;
import org.springframework.stereotype.Component;

@Component
public class PriorityCalculator {
    public Priority calculate(Vulnerability vulnerability) {

        if (vulnerability.cvss() < 0 || vulnerability.cvss() > 10) {
            throw new IllegalArgumentException("CVSS must be between 0 and 10");
        }
        if (Boolean.TRUE.equals(vulnerability.kev()) || vulnerability.cvss() != null && vulnerability.cvss() >= 9.0) {
            return Priority.URGENT;
        }

        return switch (vulnerability.severity()) {
            case CRITICAL -> Priority.HIGH;
            case HIGH -> Priority.MEDIUM;
            default -> Priority.LOW;
        };
    }
}
