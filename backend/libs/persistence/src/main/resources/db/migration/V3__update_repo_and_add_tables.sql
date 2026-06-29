CREATE TABLE scorecard_check(
                                id      UUID PRIMARY KEY,
                                name    VARCHAR(255),
                                score   INTEGER,
                                reason  TEXT,
                                repo_id UUID,

                                CONSTRAINT fk_scorecard_repo
                                    FOREIGN KEY (repo_id)
                                    REFERENCES repo(id)
                                    ON DELETE CASCADE
);

CREATE TABLE repo_topics(
                                repo_id  UUID NOT NULL,
                                topics   VARCHAR(255),

                                CONSTRAINT fk_repo_topics
                                    FOREIGN KEY (repo_id)
                                    REFERENCES repo(id)
                                    ON DELETE CASCADE
);

CREATE TABLE activity_event(
                                id         UUID PRIMARY KEY,
                                account_id UUID,
                                type       VARCHAR(255),
                                severity   VARCHAR(50),
                                actor      VARCHAR(255),
                                target     VARCHAR(255),
                                repo       UUID,
                                message    TEXT,
                                created_at TIMESTAMP WITH TIME ZONE,
                                category   VARCHAR(50),

                                CONSTRAINT fk_activity_account
                                    FOREIGN KEY (account_id)
                                    REFERENCES account(id),

                                CONSTRAINT fk_activity_repo
                                    FOREIGN KEY (repo)
                                    REFERENCES repo(id)
);

CREATE TABLE member(
                                id                   UUID PRIMARY KEY,
                                login                VARCHAR(255),
                                name                 VARCHAR(255),
                                role                 VARCHAR(50),
                                two_factor           BOOLEAN,
                                last_active_at       TIMESTAMP WITH TIME ZONE,
                                outside_collaborator BOOLEAN,
                                repo_access          INTEGER,
                                account_id           UUID,


                                CONSTRAINT fk_member_account
                                    FOREIGN KEY(account_id)
                                    REFERENCES account(id)

);

CREATE TABLE member_teams(
                                member_id            UUID PRIMARY KEY,
                                teams                VARCHAR(255),
                                 CONSTRAINT fk_member_teams
                                     FOREIGN KEY (member_id)
                                     REFERENCES member(id)

);

CREATE TABLE secret_finding(
                                 id                      UUID PRIMARY KEY,
                                 account_id              UUID,
                                 repo                    UUID,
                                 provider                VARCHAR(255),
                                 secret_type             VARCHAR(255),
                                 file                    VARCHAR(255),
                                 line                    INTEGER,
                                 commit                  VARCHAR(255),
                                 author                  VARCHAR(255),
                                 detected_at             TIMESTAMP WITH TIME ZONE,
                                 validity                VARCHAR(50),
                                 severity                VARCHAR(50),
                                 push_protection_blocked BOOLEAN,

                                 CONSTRAINT fk_secret_account
                                     FOREIGN KEY(account_id)
                                     REFERENCES account(id),

                                 CONSTRAINT fk_secret_repo
                                     FOREIGN KEY (repo)
                                     REFERENCES repo(id)
);

CREATE TABLE usage(
                                 id                       UUID PRIMARY KEY,
                                 actions_minutes          INTEGER,
                                 minutes_included         INTEGER,
                                 storage_gb               DOUBLE PRECISION,
                                 monthly_cost             DECIMAL(19,4) DEFAULT 0.0,
                                 reclaimable              DECIMAL(19,4) DEFAULT 0.0,
                                 account_id               UUID,

                                CONSTRAINT fk_usage_account
                                    FOREIGN KEY(account_id)
                                    REFERENCES account(id)
);

CREATE TABLE usage_breakdown(
                                 usage_id                 UUID NOT NULL,
                                 breakdown                VARCHAR(255),

                                 CONSTRAINT fk_usage_breakdown
                                     FOREIGN KEY(usage_id)
                                     REFERENCES usage(id)
);

CREATE TABLE usage_point(
                                id         UUID PRIMARY KEY,
                                label      VARCHAR(255),
                                minutes    INTEGER,
                                storage_gb DOUBLE PRECISION,
                                cost       DECIMAL(19, 4) DEFAULT 0.0,
                                usage_id   UUID,

                                CONSTRAINT fk_usage_point_usage
                                    FOREIGN KEY(usage_id)
                                    REFERENCES usage(id)

);

CREATE TABLE vulnerability(
                                id               UUID PRIMARY KEY,
                                account_id       UUID,
                                package_name      VARCHAR(255),
                                ecosystem        VARCHAR(255),
                                current_version  VARCHAR(255),
                                fixed_version    VARCHAR(255),
                                cvss             DOUBLE PRECISION,
                                severity         VARCHAR(50),
                                epss             DOUBLE PRECISION,
                                kev              BOOLEAN,
                                reachable        VARCHAR(50),
                                advisory_id      UUID,
                                cwe              VARCHAR(255),
                                title            VARCHAR(255),
                                has_fix_pr       BOOLEAN,
                                published_at     TIMESTAMP WITH TIME ZONE

);

CREATE TABLE vulnerability_affected_repos(
                                vulnerability_id UUID NOT NULL,
                                affected_repos   VARCHAR(255),

                                CONSTRAINT fk_vulnerability_affected_repos
                                    FOREIGN KEY(vulnerability_id)
                                    REFERENCES vulnerability(id)

);


