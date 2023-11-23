\set dbuser `echo "${POSTGRES_USER}"`
\set dbname `echo "${POSTGRES_DB}-test"`

CREATE DATABASE :"dbname";
GRANT ALL PRIVILEGES ON DATABASE :"dbname" TO :"dbuser";