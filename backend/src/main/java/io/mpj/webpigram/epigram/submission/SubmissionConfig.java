package io.mpj.webpigram.epigram.submission;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SubmissionConfig {

  @Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }
}
