package dev.cleat.scanning;

import dev.cleat.common.enums.Severity;
import dev.cleat.common.enums.Status;
import dev.cleat.persistence.entity.CodeScanAlertEntity;
import dev.cleat.persistence.repository.CodeScanAlertRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CodeScanAlertScanner {
    private static final Logger log = LoggerFactory.getLogger(CodeScanAlertScanner.class);
    private final CodeScanAlertRepository codeScanAlertRepository;

    public CodeScanAlertScanner(CodeScanAlertRepository codeScanAlertRepository) {
        this.codeScanAlertRepository = codeScanAlertRepository;
    }

    public void process(CodeScanAlertEntity codeScanAlertEntity) {
        log.info("Analyzing code scan alert for rule: {}", codeScanAlertEntity.getRule());
        if (Severity.CRITICAL.equals(codeScanAlertEntity.getSeverity())
                || Severity.HIGH.equals(codeScanAlertEntity.getSeverity())) {
            codeScanAlertEntity.setStatus(Status.OPEN);
        } else {
            codeScanAlertEntity.setStatus(Status.OPEN);
        }
        codeScanAlertRepository.save(codeScanAlertEntity);
        log.info("Code scan alert processed successfully with status: {}", codeScanAlertEntity.getStatus());
    }
}
