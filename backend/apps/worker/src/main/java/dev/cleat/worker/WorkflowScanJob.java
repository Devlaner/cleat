package dev.cleat.worker;

import dev.cleat.persistence.entity.RepoEntity;
import dev.cleat.persistence.repo.AccountRepository;
import dev.cleat.scanning.WorkflowScanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WorkflowScanJob {

    private static final Logger log = LoggerFactory.getLogger(WorkflowScanJob.class);

    private final AccountRepository accountRepository;
    private final WorkflowScanService workflowScanService;

    public WorkflowScanJob(AccountRepository accountRepository, WorkflowScanService workflowScanService) {
        this.accountRepository = accountRepository;
        this.workflowScanService = workflowScanService;
    }

    @Scheduled(fixedDelayString = "${cleat.workflow-scan.interval-ms:3600000}")
    public void run() {
        log.info("Starting workflow scan job");

        accountRepository.findAll().forEach(account -> {
            String installationId = account.getInstallationId();

            for (RepoEntity repo : account.getRepos()) {
                try {
                    workflowScanService.scanRepo(repo, installationId);
                } catch (Exception e) {
                    log.error("Failed to scan workflows for repo {}/{}", account.getLogin(), repo.getName(), e);
                }
            }
        });

        log.info("Workflow scan job completed");
    }
}
