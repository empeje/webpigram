CREATE SEQUENCE bigint_seq
    INCREMENT BY 1
    MINVALUE 1
    MAXVALUE 9223372036854775807 -- Max value of BIGINT
    START WITH 1
    CACHE 1;

CREATE TABLE epigram (
                       id BIGINT PRIMARY KEY DEFAULT nextval('bigint_seq'),
                       content TEXT NOT NULL,
                       author VARCHAR(50) NOT NULL,
                       up_votes BIGINT DEFAULT 0,
                       down_votes BIGINT DEFAULT 0,
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE epigram_topic (
                       epigram_id BIGINT NOT NULL,
                       topic VARCHAR(50) NOT NULL,
                       PRIMARY KEY (epigram_id, topic),
                       CONSTRAINT fk_epigram FOREIGN KEY (epigram_id) REFERENCES epigram(id) ON DELETE CASCADE
);
