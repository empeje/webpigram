package io.mpj.webpigram.epigram.interactions;

import com.google.common.collect.ImmutableList;

public record CommentResponse(long epigramId, ImmutableList<Comment> comments) {}
