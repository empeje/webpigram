package io.mpj.webpigram.epigram.feeds;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.google.common.collect.ImmutableList;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class FeedsServiceTest {
  private final EpigramRepository epigramRepository = mock(EpigramRepository.class);
  private final FeedsService feedsService = new FeedsService(epigramRepository);

  @Test
  public void testGetFeeds() {
    Feeds feed =
        new Feeds(
            1,
            "Test Content",
            "John Doe",
            10,
            5,
            LocalDateTime.parse("2025-03-16T21:41:50.873015"),
            ImmutableList.of("Java", "Python", "C++"));
    when(epigramRepository.getFeeds()).thenReturn(ImmutableList.of(feed));
    ImmutableList<Feeds> feeds = feedsService.getFeeds();
    assertEquals(1, feeds.size());
    assertEquals(Optional.of(feed), feeds.stream().findFirst());
  }
}
