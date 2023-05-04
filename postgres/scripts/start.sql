DO
$do$
BEGIN
   IF NOT EXISTS (SELECT * FROM pg_available_extensions WHERE name = 'dblink') THEN
      CREATE EXTENSION dblink;
   END IF;
   IF EXISTS (SELECT FROM pg_database WHERE datname = 'infradb') THEN
      RAISE NOTICE 'Database "postgres" already exists';  -- optional
   ELSE
      PERFORM dblink_exec('dbname=' || current_database()  -- current db
                        , 'CREATE DATABASE infradb');
      RAISE NOTICE 'Database "postgres" created';
   END IF;
END
$do$;