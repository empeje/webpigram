package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;

public record PagedFeeds(ImmutableList<Feeds> feeds, int page, int pageSize, boolean hasMore) {}
