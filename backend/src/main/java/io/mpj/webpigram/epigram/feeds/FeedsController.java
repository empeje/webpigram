package io.mpj.webpigram.epigram.feeds;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeedsController {
  private final FeedsService feedsService;

  public FeedsController(FeedsService feedsService) {
    this.feedsService = feedsService;
  }

  @GetMapping("/feeds")
  public Feeds getFeeds() {
    return feedsService.getFeeds();
  }
}
