CREATE TABLE account(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);
CREATE TABLE repo(
    id UUID PRIMARY KEY default gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES account(id) ,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);