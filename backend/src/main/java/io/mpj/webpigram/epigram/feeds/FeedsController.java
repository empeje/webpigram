package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

  @GetMapping("/im-in-lucky")
  public Feeds getRandomEpigram() {
    return feedsService.getRandomEpigram();
  }

  @GetMapping("/epigram/{id}")
  public ResponseEntity<Feeds> getEpigramById(@PathVariable("id") long id) {
    Feeds epigram = feedsService.getEpigramById(id);
    if (epigram == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(epigram);
  }
}
