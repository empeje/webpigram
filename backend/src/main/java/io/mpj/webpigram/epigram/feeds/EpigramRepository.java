package io.mpj.webpigram.epigram.feeds;

import static org.jooq.impl.DSL.count;
import static org.jooq.impl.DSL.field;
import static org.jooq.impl.DSL.sum;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.db.postgres.Tables;
import io.mpj.webpigram.db.postgres.tables.records.EpigramTopicRecord;
import java.time.Clock;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

@Repository
public class EpigramRepository {
  private final Clock clock;
  private final DSLContext dsl;

  public EpigramRepository(Clock clock, DSLContext dsl) {
    this.clock = clock;
    this.dsl = dsl;
  }

  // Get the first 10 epigrams sorted by popularity (upVotes - downVotes)
  public ImmutableList<Feeds> getFeeds() {
    return dsl
        .selectFrom(Tables.EPIGRAM)
        .orderBy(Tables.EPIGRAM.UP_VOTES.minus(Tables.EPIGRAM.DOWN_VOTES).desc())
        .limit(10)
        .fetch()
        .map(
            record ->
                new Feeds(
                    record.getId(),
                    record.getContent(),
                    record.getAuthor(),
                    record.getUpVotes(),
                    record.getDownVotes(),
                    record.getCreatedAt().toLocalDateTime(),
                    getTopicsForEpigram(record.getId())))
        .stream()
        .collect(ImmutableList.toImmutableList());
  }

  // Get paginated epigrams sorted by popularity (upVotes - downVotes)
  public PagedFeeds getPagedFeeds(int page, int pageSize) {
    var feeds =
        dsl
            .selectFrom(Tables.EPIGRAM)
            .orderBy(Tables.EPIGRAM.UP_VOTES.minus(Tables.EPIGRAM.DOWN_VOTES).desc())
            .limit(pageSize + 1) // Fetch one extra to determine if there are more pages
            .offset(page * pageSize)
            .fetch()
            .map(
                record ->
                    new Feeds(
                        record.getId(),
                        record.getContent(),
                        record.getAuthor(),
                        record.getUpVotes(),
                        record.getDownVotes(),
                        record.getCreatedAt().toLocalDateTime(),
                        getTopicsForEpigram(record.getId())))
            .stream()
            .collect(ImmutableList.toImmutableList());

    boolean hasMore = feeds.size() > pageSize;
    var resultFeeds = hasMore ? feeds.subList(0, pageSize) : feeds;

    return new PagedFeeds(ImmutableList.copyOf(resultFeeds), page, pageSize, hasMore);
  }

  // Get the top 5 trending topics based on epigram count and upvotes
  public ImmutableList<TrendingTopic> getTrendingTopics() {
    var epigramTopic = Tables.EPIGRAM_TOPIC;
    var epigram = Tables.EPIGRAM;

    return dsl
        .select(
            epigramTopic.TOPIC,
            count().as("epigram_count"),
            sum(epigram.UP_VOTES).as("total_upvotes"))
        .from(epigramTopic)
        .join(epigram)
        .on(epigramTopic.EPIGRAM_ID.eq(epigram.ID))
        .groupBy(epigramTopic.TOPIC)
        .orderBy(
            field("total_upvotes", Long.class).desc(), field("epigram_count", Long.class).desc())
        .limit(5)
        .fetch()
        .map(
            record ->
                new TrendingTopic(
                    record.get(epigramTopic.TOPIC),
                    record.get("epigram_count", Long.class),
                    record.get("total_upvotes", Long.class)))
        .stream()
        .collect(ImmutableList.toImmutableList());
  }

  // Helper method to get topics for an epigram
  private ImmutableList<String> getTopicsForEpigram(long epigramId) {
    return dsl
        .selectFrom(Tables.EPIGRAM_TOPIC)
        .where(Tables.EPIGRAM_TOPIC.EPIGRAM_ID.eq(epigramId))
        .fetch()
        .map(EpigramTopicRecord::getTopic)
        .stream()
        .collect(ImmutableList.toImmutableList());
  }

  // Create a new epigram with the given content, author and topics
  public long createEpigram(String content, String author, ImmutableList<String> topics) {
    // Insert the epigram
    var epigramRecord = dsl.newRecord(Tables.EPIGRAM);
    epigramRecord.setContent(content);
    epigramRecord.setAuthor(author);
    epigramRecord.setUpVotes(0L);
    epigramRecord.setDownVotes(0L);
    epigramRecord.setCreatedAt(OffsetDateTime.from(clock.instant().atZone(ZoneId.systemDefault())));
    epigramRecord.store();

    // Insert the topics
    for (String topic : topics) {
      var topicRecord = dsl.newRecord(Tables.EPIGRAM_TOPIC);
      topicRecord.setEpigramId(epigramRecord.getId());
      topicRecord.setTopic(topic);
      topicRecord.store();
    }

    return epigramRecord.getId();
  }
}
