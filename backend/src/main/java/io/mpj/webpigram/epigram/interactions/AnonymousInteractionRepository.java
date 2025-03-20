package io.mpj.webpigram.epigram.interactions;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.db.postgres.Tables;
import io.mpj.webpigram.db.postgres.tables.records.AnonymousInteractionRecord;
import io.mpj.webpigram.db.postgres.tables.records.CommentRecord;
import io.mpj.webpigram.db.postgres.tables.records.EpigramRecord;
import java.time.Clock;
import java.time.OffsetDateTime;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AnonymousInteractionRepository {
  private final Clock clock;
  private final DSLContext dsl;

  public AnonymousInteractionRepository(Clock clock, DSLContext dsl) {
    this.clock = clock;
    this.dsl = dsl;
  }

  @Transactional
  public long addComment(long epigramId, String content, String ipHash) {
    // First, create the comment
    CommentRecord commentRecord = dsl.newRecord(Tables.COMMENT);
    commentRecord.setEpigramId(epigramId);
    commentRecord.setContent(content);
    commentRecord.setCreatedAt(OffsetDateTime.now(clock));
    commentRecord.store();

    // Then, record the interaction
    AnonymousInteractionRecord interactionRecord = dsl.newRecord(Tables.ANONYMOUS_INTERACTION);
    interactionRecord.setEpigramId(epigramId);
    interactionRecord.setInteractionType(InteractionType.COMMENT.name());
    interactionRecord.setCommentId(commentRecord.getId());
    interactionRecord.setIpHash(ipHash);
    interactionRecord.setCreatedAt(OffsetDateTime.now(clock));
    interactionRecord.store();

    return commentRecord.getId();
  }

  @Transactional
  public void addUpvote(long epigramId, String ipHash) {
    // Record the interaction
    AnonymousInteractionRecord interactionRecord = dsl.newRecord(Tables.ANONYMOUS_INTERACTION);
    interactionRecord.setEpigramId(epigramId);
    interactionRecord.setInteractionType(InteractionType.UPVOTE.name());
    interactionRecord.setIpHash(ipHash);
    interactionRecord.setCreatedAt(OffsetDateTime.now(clock));
    interactionRecord.store();

    // Update the epigram's upvote count
    dsl.update(Tables.EPIGRAM)
        .set(Tables.EPIGRAM.UP_VOTES, Tables.EPIGRAM.UP_VOTES.add(1))
        .where(Tables.EPIGRAM.ID.eq(epigramId))
        .execute();
  }

  @Transactional
  public void addDownvote(long epigramId, String ipHash) {
    // Record the interaction
    AnonymousInteractionRecord interactionRecord = dsl.newRecord(Tables.ANONYMOUS_INTERACTION);
    interactionRecord.setEpigramId(epigramId);
    interactionRecord.setInteractionType(InteractionType.DOWNVOTE.name());
    interactionRecord.setIpHash(ipHash);
    interactionRecord.setCreatedAt(OffsetDateTime.now(clock));
    interactionRecord.store();

    // Update the epigram's downvote count
    dsl.update(Tables.EPIGRAM)
        .set(Tables.EPIGRAM.DOWN_VOTES, Tables.EPIGRAM.DOWN_VOTES.add(1))
        .where(Tables.EPIGRAM.ID.eq(epigramId))
        .execute();
  }

  public ImmutableList<Comment> getCommentsForEpigram(long epigramId) {
    return dsl
        .selectFrom(Tables.COMMENT)
        .where(Tables.COMMENT.EPIGRAM_ID.eq(epigramId))
        .orderBy(Tables.COMMENT.CREATED_AT.desc())
        .fetch()
        .map(
            record ->
                new Comment(
                    record.getId(),
                    record.getEpigramId(),
                    record.getContent(),
                    record.getCreatedAt().toLocalDateTime()))
        .stream()
        .collect(ImmutableList.toImmutableList());
  }

  public boolean hasInteracted(long epigramId, String ipHash, InteractionType type) {
    return dsl.fetchExists(
        dsl.selectFrom(Tables.ANONYMOUS_INTERACTION)
            .where(Tables.ANONYMOUS_INTERACTION.EPIGRAM_ID.eq(epigramId))
            .and(Tables.ANONYMOUS_INTERACTION.IP_HASH.eq(ipHash))
            .and(Tables.ANONYMOUS_INTERACTION.INTERACTION_TYPE.eq(type.name())));
  }

  public long[] getVoteCounts(long epigramId) {
    EpigramRecord record =
        dsl.selectFrom(Tables.EPIGRAM).where(Tables.EPIGRAM.ID.eq(epigramId)).fetchOne();

    if (record == null) {
      return new long[] {0, 0};
    }

    return new long[] {record.getUpVotes(), record.getDownVotes()};
  }
}
