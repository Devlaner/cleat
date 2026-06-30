package dev.cleat.worker;

import dev.cleat.persistence.repository.CodeScanAlertRepository;
import dev.cleat.persistence.repository.SecretFindingRepository;
import dev.cleat.persistence.repository.VulnerabilityRepository;
import dev.cleat.scanning.CodeScanAlertScanner;
import dev.cleat.scanning.SecretFindingScanner;
import dev.cleat.scanning.VulnerabilityScanner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SecurityScanWorker {
    private final VulnerabilityScanner vulnerabilityScanner;
    private final VulnerabilityRepository vulnerabilityRepository;
    private static final Logger LOG = LoggerFactory.getLogger(SecurityScanWorker.class);
    private final SecretFindingRepository secretFindingRepository;
    private final SecretFindingScanner secretFindingScanner;
    private final CodeScanAlertRepository codeScanAlertRepository;
    private final CodeScanAlertScanner codeScanAlertScanner;

    public SecurityScanWorker(
            VulnerabilityScanner vulnerabilityScanner,
            VulnerabilityRepository vulnerabilityRepository,
            SecretFindingRepository secretFindingRepository,
            SecretFindingScanner secretFindingScanner,
            CodeScanAlertRepository codeScanAlertRepository,
            CodeScanAlertScanner codeScanAlertScanner) {
        this.vulnerabilityScanner = vulnerabilityScanner;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.secretFindingRepository = secretFindingRepository;
        this.secretFindingScanner = secretFindingScanner;
        this.codeScanAlertRepository = codeScanAlertRepository;
        this.codeScanAlertScanner = codeScanAlertScanner;
    }

    @Scheduled(fixedDelay = 600000)
    public void runSecurityScan() {
        LOG.info("Starting scheduled security scan...");
        processVulns();
        processSecrets();
        processAlerts();
        LOG.info("Scheduled security scan completed.");
    }

    private void processVulns() {
        vulnerabilityRepository.findAll().forEach(vulnerability -> {
            try {
                vulnerabilityScanner.processAndSave(vulnerability);
            } catch (Exception ex) {
                LOG.error("Failed to process vulnerability ID: {}.Skipping...", vulnerability.getId(), ex);
            }
        });
    }

    private void processSecrets() {
        secretFindingRepository.findAll().forEach(secret -> {
            try {
                secretFindingScanner.process(secret);
            } catch (Exception ex) {
                LOG.error("Failed to process secret ID: {}", secret.getId(), ex);
            }
        });
    }

    private void processAlerts() {
        codeScanAlertRepository.findAll().forEach(alert -> {
            try {
                codeScanAlertScanner.process(alert);
                codeScanAlertRepository.save(alert);
            } catch (Exception ex) {
                LOG.error("Failed to process ID: {}", alert.getId(), ex);
            }
        });
    }
}
