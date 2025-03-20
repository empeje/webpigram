package io.mpj.webpigram.epigram.submission;

import io.mpj.webpigram.config.CaptchaVerificationService;
import io.mpj.webpigram.epigram.feeds.FeedsService;
import org.springframework.stereotype.Service;

@Service
public class SubmissionService {

  private final FeedsService feedsService;
  private final CaptchaVerificationService captchaVerificationService;

  public SubmissionService(
      FeedsService feedsService, CaptchaVerificationService captchaVerificationService) {
    this.feedsService = feedsService;
    this.captchaVerificationService = captchaVerificationService;
  }

  public long submitEpigram(SubmissionRequest request) {
    // Verify reCAPTCHA if enabled
    captchaVerificationService.verifyRecaptchaIfEnabled(request.recaptchaToken(), "SUBMIT_EPIGRAM");

    // Create epigram
    return feedsService.createEpigram(
        request.content(), request.author(), request.getTopicsAsList());
  }
}
