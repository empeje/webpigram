CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username character varying(50) NOT NULL UNIQUE,
                       email character varying(100) NOT NULL UNIQUE,
                       password_hash character varying(255) NOT NULL,
                       display_name character varying(100),
                       bio text,
                       profile_image_url character varying(255),
                       created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
                       updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
