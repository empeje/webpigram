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
}
