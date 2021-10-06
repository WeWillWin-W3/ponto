#!/bin/sh
psql -d ponto < /docker-entrypoint-initdb.d/sql/schema.sql
psql -d ponto < /docker-entrypoint-initdb.d/sql/seed.sql
psql -d ponto < /docker-entrypoint-initdb.d/sql/functions.sql
