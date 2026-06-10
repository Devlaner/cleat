CREATE TABLE account (
    id UUID PRIMARY KEY ,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE repo(
    id UUID PRIMARY KEY,
    account_id UUID NOT NULL ,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL ,
    CONSTRAINT fk_repo_account
        FOREIGN KEY (account_id)
        REFERENCES account(id)
)