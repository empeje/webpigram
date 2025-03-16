package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import java.time.LocalDateTime;

public record Feeds(
    long id,
    String content,
    String author,
    long upVotes,
    long downVotes,
    LocalDateTime createdAt,
    ImmutableList<String> topics) {}
