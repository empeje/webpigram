package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FeedsController {
  private final FeedsService feedsService;
  private static final int DEFAULT_PAGE_SIZE = 10;

  public FeedsController(FeedsService feedsService) {
    this.feedsService = feedsService;
  }

  @GetMapping("/feeds")
  public ImmutableList<Feeds> getFeeds() {
    return feedsService.getFeeds();
  }

  @GetMapping("/feeds/paged")
  public PagedFeeds getPagedFeeds(
      @RequestParam(value = "page", defaultValue = "0") int page,
      @RequestParam(value = "pageSize", defaultValue = "10") int pageSize) {
    return feedsService.getPagedFeeds(page, pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE);
  }

  @GetMapping("/trending")
  public ImmutableList<TrendingTopic> getTrendingTopics() {
    return feedsService.getTrendingTopics();
  }
}
