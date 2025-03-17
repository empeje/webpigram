CREATE TABLE comment (
    id BIGINT PRIMARY KEY DEFAULT nextval('bigint_seq'),
    epigram_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_epigram_comment FOREIGN KEY (epigram_id) REFERENCES epigram(id) ON DELETE CASCADE
);

CREATE TABLE anonymous_interaction (
    id BIGINT PRIMARY KEY DEFAULT nextval('bigint_seq'),
    epigram_id BIGINT NOT NULL,
    interaction_type VARCHAR(10) NOT NULL, -- 'UPVOTE', 'DOWNVOTE', 'COMMENT'
    comment_id BIGINT,
    ip_hash VARCHAR(64), -- Store hashed IP for rate limiting
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_epigram_interaction FOREIGN KEY (epigram_id) REFERENCES epigram(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_interaction FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX idx_anonymous_interaction_epigram_id ON anonymous_interaction(epigram_id);
CREATE INDEX idx_anonymous_interaction_type ON anonymous_interaction(interaction_type);
CREATE INDEX idx_comment_epigram_id ON comment(epigram_id); 