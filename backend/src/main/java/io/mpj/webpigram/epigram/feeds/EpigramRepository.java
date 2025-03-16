package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.stereotype.Repository;

@Repository
public class EpigramRepository {
  private final Clock clock;

  public EpigramRepository(Clock clock) {
    this.clock = clock;
  }

  public ImmutableList<Feeds> getFeeds() {
    return ImmutableList.of(
        new Feeds(
            1,
            "Hello",
            "John Doe",
            10,
            5,
            LocalDateTime.from(clock.instant()),
            ImmutableList.of("Java", "Python", "C++")));
  }
}
