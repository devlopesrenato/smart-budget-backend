#!/bin/bash
set -e

# psql -h postgresdb -U postgres -d postgres < /docker-entrypoint-initdb.d/start.sql

# until pg_isready -h postgresdb -p 5432 > /dev/null 2>&1; do
#   echo "Waiting for Postgres to start..."
#   sleep 1
# done

# pg_ctl -D /var/lib/postgresql/data -l logfile start
# pg_ctl -D /var/lib/postgresql/data stop
