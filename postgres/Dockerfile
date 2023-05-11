FROM postgres

COPY scripts/start.sql /docker-entrypoint-initdb.d/start.sql

# COPY entrypoint.sh /

RUN usermod -u 1000 postgres

# ENTRYPOINT ["/entrypoint.sh"]