FROM postgres

COPY scripts/start.sql /docker-entrypoint-initdb.d/start.sql

RUN usermod -u 1000 postgres