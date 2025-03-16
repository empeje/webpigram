package io.mpj.webpigram.epigram.feeds;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeedsConfig {
  @Bean
  public Clock clock() {
    return Clock.systemDefaultZone();
  }
}
