CREATE TABLE account (
    id UUID PRIMARY KEY,
    login VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    repo_count INT DEFAULT 0,
    member_count INT DEFAULT 0,
    posture_score FLOAT DEFAULT 0.0,
    monthly_spend FLOAT DEFAULT 0.0,
    reclaimable FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE repo(
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    visibility VARCHAR(50) NOT NULL,
    language VARCHAR(100),
    stars int DEFAULT 0,
    default_branch VARCHAR(255),
    branch_protected BOOLEAN DEFAULT FALSE,
    has_readme BOOLEAN DEFAULT FALSE,
    has_license BOOLEAN DEFAULT FALSE,
    has_contributing BOOLEAN DEFAULT FALSE,
    has_codeowners BOOLEAN DEFAULT FALSE,
    has_ci BOOLEAN DEFAULT FALSE,
    size_mb FLOAT DEFAULT 0.0,
    last_pushed_at TIMESTAMP WITH TIME ZONE,
    archived BOOLEAN DEFAULT FALSE,
    open_vulns FLOAT DEFAULT 0.0,
    open_secrets FLOAT DEFAULT 0.0,
    open_code_alerts INT DEFAULT 0,
    stale_branches INT DEFAULT 0,
    open_prs INT DEFAULT 0,
    hygiene_score FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL ,
    CONSTRAINT fk_repo_account
        FOREIGN KEY (account_id)
        REFERENCES account(id)
);

CREATE INDEX idx_repo_account_id ON repo(account_id);


