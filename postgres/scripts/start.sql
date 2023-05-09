DO
$do$
BEGIN
   BEGIN
      CREATE EXTENSION IF NOT EXISTS dblink;
   END
   BEGIN
      IF EXISTS (SELECT FROM pg_database WHERE datname = 'budgetdb') THEN
         RAISE NOTICE 'Database "budgetdb" already exists';  -- optional
      ELSE
         PERFORM dblink_exec('dbname=' || current_database()  -- current db
                           , 'CREATE DATABASE budgetdb');
         RAISE NOTICE 'Database "budgetdb" created';
      END IF;
   END
END
$do$;