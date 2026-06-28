package dev.cleat.worker;

import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.repository.AccountRepository;
import dev.cleat.scanning.WorkflowScanService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WorkflowScanJob {

    private static final Logger LOG = LoggerFactory.getLogger(WorkflowScanJob.class);

    private final AccountRepository accountRepository;
    private final WorkflowScanService workflowScanService;

    public WorkflowScanJob(AccountRepository accountRepository, WorkflowScanService workflowScanService) {
        this.accountRepository = accountRepository;
        this.workflowScanService = workflowScanService;
    }

    @Scheduled(fixedDelayString = "${cleat.workflow-scan.interval-ms:3600000}")
    @Transactional
    public void run() {
        LOG.info("Starting workflow scan job");

        accountRepository.findAll().forEach(account -> {
            String installationId = account.getInstallationId();

            for (RepoEntity repo : account.getRepos()) {
                try {
                    workflowScanService.scanRepo(repo, installationId);
                } catch (Exception e) {
                    LOG.error("Failed to scan workflows for repo {}/{}", account.getLogin(), repo.getName(), e);
                }
            }
        });

        LOG.info("Workflow scan job completed");
    }
}
