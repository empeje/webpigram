package io.mpj.webpigram.epigram.anonymous;

import java.util.Optional;

public record AnonymousInteractionResponse(
    boolean success,
    String message,
    Optional<Long> commentId, // Only populated for comment interactions
    Long upvotes, // Current upvote count after interaction
    Long downvotes // Current downvote count after interaction
    ) {}
