package dev.cleat.domain;

import dev.cleat.common.enums.Priority;
import dev.cleat.common.enums.Reachable;
import dev.cleat.common.enums.Severity;
import dev.cleat.domain.model.Vulnerability;
import org.springframework.stereotype.Component;

@Component
public class PriorityCalculator {
    public Priority calculate(Vulnerability vulnerability) {

        if (vulnerability.cvss() < 0 || vulnerability.cvss() > 10) {
            throw new IllegalArgumentException("CVSS must be between 0 and 10");
        }
        if (vulnerability.kev() || vulnerability.cvss() >= 9.0 && vulnerability.reachable() == Reachable.REACHABLE) {
            return Priority.URGENT;
        }

        if (vulnerability.epss() > 0.1 || vulnerability.severity() == Severity.CRITICAL) {
            return Priority.HIGH;
        }

        if (vulnerability.cvss() >= 7.0) {
            return Priority.MEDIUM;
        }

        return Priority.LOW;
    }
}
