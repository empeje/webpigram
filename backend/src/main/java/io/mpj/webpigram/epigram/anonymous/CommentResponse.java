package io.mpj.webpigram.epigram.anonymous;

import com.google.common.collect.ImmutableList;

public record CommentResponse(long epigramId, ImmutableList<Comment> comments) {}
