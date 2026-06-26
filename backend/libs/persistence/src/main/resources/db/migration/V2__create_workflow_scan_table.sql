CREATE TABLE workflow_scan (
                               id                UUID PRIMARY KEY,
                               repo_id           UUID NOT NULL,
                               workflow_path     VARCHAR(500) NOT NULL,
                               unpinned_actions  INTEGER NOT NULL DEFAULT 0,
                               broad_permissions BOOLEAN NOT NULL DEFAULT FALSE,
                               missing_oidc      BOOLEAN NOT NULL DEFAULT FALSE,
                               risk_score        INTEGER NOT NULL DEFAULT 0,
                               scanned_at        TIMESTAMP WITH TIME ZONE NOT NULL,

                               CONSTRAINT fk_workflow_scan_repo
                                   FOREIGN KEY (repo_id)
                                       REFERENCES repo(id)
                                       ON DELETE CASCADE
);

CREATE INDEX idx_workflow_scan_repo_id ON workflow_scan(repo_id);