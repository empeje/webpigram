package io.mpj.webpigram.epigram.interactions;

import java.time.LocalDateTime;

public record Comment(long id, long epigramId, String content, LocalDateTime createdAt) {}
