package dev.cleat.scanning;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Status;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CodeScanAlertScanner {
    private static final Logger LOG = LoggerFactory.getLogger(CodeScanAlertScanner.class);

    public void process(CodeScanAlertEntity codeScanAlertEntity) {
        LOG.info("Analyzing code scan alert for rule: {}", codeScanAlertEntity.getRule());
        if (Severity.CRITICAL.equals(codeScanAlertEntity.getSeverity())
                || Severity.HIGH.equals(codeScanAlertEntity.getSeverity())) {
            codeScanAlertEntity.setStatus(Status.OPEN);
        } else {
            codeScanAlertEntity.setStatus(Status.OPEN);
        }
    }
}
