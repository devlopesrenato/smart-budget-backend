DO
$$
BEGIN
    IF NOT EXISTS (SELECT * FROM users WHERE email = 'admin@admin.com') THEN
        INSERT INTO users (email, name, password, "createdAt", "updatedAt") VALUES ('admin@admin.com', 'Admin','$2a$10$ObB0lGG9EjH1NSpbcjPape0ONLHQN33o2/1jIxLYUIT.sDj0WvURC',now(),now());
        RAISE NOTICE 'User created successfully.';
    ELSE
        RAISE NOTICE 'User with email admin@admin.com already exists.';
    END IF;
END
$$;

