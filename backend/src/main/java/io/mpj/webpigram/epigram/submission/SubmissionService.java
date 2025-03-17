package io.mpj.webpigram.epigram.submission;

import io.mpj.webpigram.epigram.feeds.EpigramRepository;
import java.net.URI;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class SubmissionService {

  private final EpigramRepository epigramRepository;
  private final RestTemplate restTemplate;
  private final String recaptchaSecret;
  private final boolean recaptchaEnabled;
  private final boolean isEnterpriseRecaptcha;
  private final String projectId;
  private final String siteKey;

  public SubmissionService(
      EpigramRepository epigramRepository,
      RestTemplate restTemplate,
      @Value("${app.recaptcha.secret:}") String recaptchaSecret,
      @Value("${app.recaptcha.enabled:false}") boolean recaptchaEnabled,
      @Value("${app.recaptcha.enterprise:true}") boolean isEnterpriseRecaptcha,
      @Value("${app.recaptcha.project-id:}") String projectId,
      @Value("${app.recaptcha.site-key:}") String siteKey) {
    this.epigramRepository = epigramRepository;
    this.restTemplate = restTemplate;
    this.recaptchaSecret = recaptchaSecret;
    this.recaptchaEnabled = recaptchaEnabled;
    this.isEnterpriseRecaptcha = isEnterpriseRecaptcha;
    this.projectId = projectId;
    this.siteKey = siteKey;
  }

  public long submitEpigram(SubmissionRequest request) {
    // Verify reCAPTCHA if enabled
    if (recaptchaEnabled) {
      verifyRecaptcha(request.recaptchaToken());
    }

    // Create epigram
    return epigramRepository.createEpigram(
        request.content(), request.author(), request.getTopicsAsList());
  }

  private void verifyRecaptcha(String token) {
    if (isEnterpriseRecaptcha) {
      // Enterprise reCAPTCHA verification
      verifyEnterpriseRecaptcha(token);
    } else {
      // Standard reCAPTCHA verification
      verifyStandardRecaptcha(token);
    }
  }

  private void verifyEnterpriseRecaptcha(String token) {
    try {
      // Create the URI with API key as a query parameter
      String url =
          String.format(
              "https://recaptchaenterprise.googleapis.com/v1/projects/%s/assessments", projectId);

      URI uri =
          UriComponentsBuilder.fromUriString(url)
              .queryParam("key", recaptchaSecret)
              .build()
              .toUri();

      // For Enterprise reCAPTCHA, we need to send a different payload
      // The siteKey is different from the API key/secret
      Map<String, Object> event =
          Map.of(
              "token", token,
              "siteKey", siteKey,
              "expectedAction", "SUBMIT_EPIGRAM");

      Map<String, Object> requestBody = Map.of("event", event);

      // Log the request for debugging
      System.out.println("reCAPTCHA request URL: " + uri);
      System.out.println("reCAPTCHA request body: " + requestBody);

      // Create the request and send it
      RequestEntity<Map<String, Object>> request = RequestEntity.post(uri).body(requestBody);

      ResponseEntity<Map> response = restTemplate.exchange(request, Map.class);

      if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
        // Check the risk score
        Map<String, Object> responseBody = response.getBody();
        Map<String, Object> riskAnalysis = (Map<String, Object>) responseBody.get("riskAnalysis");
        Map<String, Object> tokenProperties =
            (Map<String, Object>) responseBody.get("tokenProperties");

        // Validate token properties
        if (tokenProperties != null && Boolean.FALSE.equals(tokenProperties.get("valid"))) {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reCAPTCHA token");
        }

        // Check the risk score
        if (riskAnalysis != null && riskAnalysis.get("score") != null) {
          double score = Double.parseDouble(riskAnalysis.get("score").toString());
          if (score < 0.5) { // Threshold can be adjusted
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA score too low");
          }
        } else {
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reCAPTCHA response");
        }
      } else {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed");
      }
    } catch (Exception e) {
      if (e instanceof ResponseStatusException) {
        throw e;
      }
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Error verifying reCAPTCHA: " + e.getMessage(), e);
    }
  }

  private void verifyStandardRecaptcha(String token) {
    String url =
        "https://www.google.com/recaptcha/api/siteverify?secret="
            + recaptchaSecret
            + "&response="
            + token;

    try {
      Map<String, Object> response = restTemplate.postForObject(url, null, Map.class);

      if (response == null || !Boolean.TRUE.equals(response.get("success"))) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed");
      }

      // Optional: Check score for v3 reCAPTCHA
      if (response.containsKey("score")) {
        double score = Double.parseDouble(response.get("score").toString());
        if (score < 0.5) { // Threshold can be adjusted
          throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA score too low");
        }
      }
    } catch (Exception e) {
      if (e instanceof ResponseStatusException) {
        throw e;
      }
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR, "Error verifying reCAPTCHA", e);
    }
  }
}
