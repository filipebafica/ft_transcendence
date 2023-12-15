\set db_user `echo "${POSTGRES_USER}"`
\set db_name `echo "${POSTGRES_DB}"`

-- -- Connect to the new database
-- \c :"db_name";

-- -- Create the user table if not exists
-- CREATE TABLE IF NOT EXISTS "user" (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL
--     -- Add other columns as needed
-- );

-- -- Create the user_chat table if not exists
-- CREATE TABLE IF NOT EXISTS "user_chat" (
--     id SERIAL PRIMARY KEY,
--     user_id INT REFERENCES "user"(id),
--     blocked_users JSONB NOT NULL DEFAULT '[]'::JSONB
--     -- Add other columns as needed
-- );

-- -- Create the room table if not exists
-- CREATE TABLE IF NOT EXISTS "room" (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) NOT NULL,
--     owner_id INT NOT NULL,
--     admin_id JSONB NOT NULL DEFAULT '[]'::JSONB,
--     public BOOLEAN NOT NULL,
--     participants JSONB NOT NULL DEFAULT '[]'::JSONB
--     -- Add other columns as needed
-- );
