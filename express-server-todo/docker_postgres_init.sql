CREATE EXTENSION pgcrypto;

CREATE TABLE IF NOT EXISTS user_account(
    id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

INSERT INTO user_account (id, password) VALUES 
('user 1', crypt('pw1',gen_salt('bf'))), 
('user 2', crypt('pw2',gen_salt('bf')));

CREATE TABLE IF NOT EXISTS todo(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (userid)
            REFERENCES user_account(id)
            ON DELETE CASCADE
);

INSERT INTO todo (description, userid) VALUES 
('todo item by user 1', 'user 1'),
('another item by user 1', 'user 1'),
('todo item by user 2', 'user 2'),
('another item by user 2', 'user 2');

CREATE TABLE IF NOT EXISTS refresh_token(
    userid VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (userid)
            REFERENCES user_account(id)
            ON DELETE CASCADE
);

select * from todo;
select * from user_account; 
select * from refresh_token;