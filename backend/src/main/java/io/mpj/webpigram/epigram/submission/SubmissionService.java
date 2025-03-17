package io.mpj.webpigram.epigram.submission;

import io.mpj.webpigram.config.CaptchaVerificationService;
import io.mpj.webpigram.epigram.feeds.EpigramRepository;
import org.springframework.stereotype.Service;

@Service
public class SubmissionService {

  private final EpigramRepository epigramRepository;
  private final CaptchaVerificationService captchaVerificationService;

  public SubmissionService(
      EpigramRepository epigramRepository, CaptchaVerificationService captchaVerificationService) {
    this.epigramRepository = epigramRepository;
    this.captchaVerificationService = captchaVerificationService;
  }

  public long submitEpigram(SubmissionRequest request) {
    // Verify reCAPTCHA if enabled
    captchaVerificationService.verifyRecaptchaIfEnabled(request.recaptchaToken(), "SUBMIT_EPIGRAM");

    // Create epigram
    return epigramRepository.createEpigram(
        request.content(), request.author(), request.getTopicsAsList());
  }
}
