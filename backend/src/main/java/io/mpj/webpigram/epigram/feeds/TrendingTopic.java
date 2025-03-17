package io.mpj.webpigram.epigram.feeds;

/** Represents a trending topic with its name and the count of epigrams associated with it. */
public record TrendingTopic(String topic, long epigramCount, long totalUpvotes) {}
