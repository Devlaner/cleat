CREATE TABLE code_scan_alerts(
                               id          UUID PRIMARY KEY,
                               account_id  UUID NOT NULL,
                               severity    VARCHAR(50) NOT NULL,
                               file        VARCHAR(255) NOT NULL,
                               line        INTEGER CHECK (line>=0),
                               branch      VARCHAR(250),
                               status      VARCHAR(50) NOT NULL ,
                               tool        VARCHAR(255) NOT NULL,
                               detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               description TEXT,
                               repo        UUID NOT NULL,
                               rule        VARCHAR(250) NOT NULL,
                               rule_id     UUID NOT NULL,

                               CONSTRAINT fk_account
                                   FOREIGN KEY(account_id)
                                   REFERENCES account(id)
                                   ON DELETE CASCADE,

                               CONSTRAINT fk_repo
                                   FOREIGN KEY(repo)
                                   REFERENCES repo(id)
                                   ON DELETE CASCADE,

                               CONSTRAINT chk_severity
                                   CHECK (severity
                                   IN('CRITICAL','HIGH','MEDIUM','LOW')),

                               CONSTRAINT chk_status
                                   CHECK (status IN('OPEN','FIXED','DISMISSED'))

);

CREATE INDEX idx_scan_alerts_repo_severity on code_scan_alerts(repo,severity);
CREATE INDEX idx_scan_alerts_detected_at on code_scan_alerts(detected_at);

