package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeedsController {
  private final FeedsService feedsService;

  public FeedsController(FeedsService feedsService) {
    this.feedsService = feedsService;
  }

  @GetMapping("/feeds")
  public ImmutableList<Feeds> getFeeds() {
    return feedsService.getFeeds();
  }
}
