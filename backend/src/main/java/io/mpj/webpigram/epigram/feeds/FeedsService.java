package io.mpj.webpigram.epigram.feeds;

import com.google.common.collect.ImmutableList;
import org.springframework.stereotype.Service;

@Service
public class FeedsService {
  private final EpigramRepository epigramRepository;

  public FeedsService(EpigramRepository epigramRepository) {
    this.epigramRepository = epigramRepository;
  }

  public ImmutableList<Feeds> getFeeds() {
    return epigramRepository.getFeeds();
  }

  public PagedFeeds getPagedFeeds(int page, int pageSize) {
    return epigramRepository.getPagedFeeds(page, pageSize);
  }

  public ImmutableList<TrendingTopic> getTrendingTopics() {
    return epigramRepository.getTrendingTopics();
  }

  public Feeds getRandomEpigram() {
    return epigramRepository.getRandomEpigram();
  }

  public Feeds getEpigramById(long id) {
    return epigramRepository.getEpigramById(id);
  }
}
