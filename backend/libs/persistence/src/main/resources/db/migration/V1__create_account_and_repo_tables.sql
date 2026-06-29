CREATE TABLE account (
                         id              UUID PRIMARY KEY,
                         login           VARCHAR(255) NOT NULL,
                         name            VARCHAR(255) NOT NULL,
                         type            VARCHAR(50)  NOT NULL,
                         plan            VARCHAR(50),
                         repo_count      INTEGER DEFAULT 0,
                         member_count    INTEGER DEFAULT 0,
                         posture_score   INTEGER DEFAULT 0,
                         monthly_spend   DECIMAL(19,4) DEFAULT 0.0,
                         reclaimable     DECIMAL(19,4) DEFAULT 0.0,
                         created_at      TIMESTAMP WITH TIME ZONE NOT NULL,
                         installation_id VARCHAR(255)
);

CREATE TABLE repo (
                      id               UUID PRIMARY KEY,
                      name             VARCHAR(255) NOT NULL,
                      account_id       UUID NOT NULL,
                      visibility       VARCHAR(50),
                      language         VARCHAR(100),
                      stars            INTEGER,
                      default_branch   VARCHAR(255),
                      branch_protected BOOLEAN,
                      has_readme       BOOLEAN,
                      has_license      BOOLEAN,
                      has_contributing BOOLEAN,
                      has_codeowners   BOOLEAN,
                      has_ci           BOOLEAN,
                      size_mb          DOUBLE PRECISION,
                      last_pushed_at   TIMESTAMP WITH TIME ZONE,
                      archived         BOOLEAN,
                      open_vulns       INTEGER,
                      open_secrets     INTEGER,
                      open_code_alerts INTEGER,
                      stale_branches   INTEGER,
                      open_prs         INTEGER,
                      hygiene_score    INTEGER,
                      created_at       TIMESTAMP WITH TIME ZONE NOT NULL,

                      CONSTRAINT fk_account
                          FOREIGN KEY (account_id)
                          REFERENCES account(id)
                          ON DELETE CASCADE
);

CREATE INDEX idx_repo_account_id ON repo(account_id);
