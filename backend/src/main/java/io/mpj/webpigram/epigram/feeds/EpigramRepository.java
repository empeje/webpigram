package io.mpj.webpigram.epigram.feeds;

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
