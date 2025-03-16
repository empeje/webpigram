package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import java.time.Clock;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;

@Service
public class FeedsService {
  private final Clock clock;

  public FeedsService(Clock clock) {
    this.clock = clock;
  }

  public Feeds getFeeds() {
    return new Feeds(
        1,
        "Hello",
        "John Doe",
        10,
        5,
        LocalDateTime.from(clock.instant()),
        ImmutableList.of("Java", "Python", "C++"));
  }
}
