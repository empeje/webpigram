package io.mpj.webpigram.config;

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
public class CaptchaVerificationService {
  private final RestTemplate restTemplate;
  private final String recaptchaSecret;
  private final boolean recaptchaEnabled;
  private final boolean isEnterpriseRecaptcha;
  private final String projectId;
  private final String siteKey;

  public CaptchaVerificationService(
      RestTemplate restTemplate,
      @Value("${app.recaptcha.secret:}") String recaptchaSecret,
      @Value("${app.recaptcha.enabled:false}") boolean recaptchaEnabled,
      @Value("${app.recaptcha.enterprise:true}") boolean isEnterpriseRecaptcha,
      @Value("${app.recaptcha.project-id:}") String projectId,
      @Value("${app.recaptcha.site-key:}") String siteKey) {
    this.restTemplate = restTemplate;
    this.recaptchaSecret = recaptchaSecret;
    this.recaptchaEnabled = recaptchaEnabled;
    this.isEnterpriseRecaptcha = isEnterpriseRecaptcha;
    this.projectId = projectId;
    this.siteKey = siteKey;
  }

  /**
   * Verifies a reCAPTCHA token if reCAPTCHA is enabled.
   *
   * @param token The reCAPTCHA token to verify
   * @throws ResponseStatusException if verification fails
   */
  public void verifyRecaptchaIfEnabled(String token, String expectedAction) {
    if (recaptchaEnabled) {
      verifyRecaptcha(token, expectedAction);
    }
  }

  /**
   * Checks if reCAPTCHA is enabled.
   *
   * @return true if reCAPTCHA is enabled, false otherwise
   */
  public boolean isRecaptchaEnabled() {
    return recaptchaEnabled;
  }

  private void verifyRecaptcha(String token, String expectedAction) {
    if (isEnterpriseRecaptcha) {
      // Enterprise reCAPTCHA verification
      verifyEnterpriseRecaptcha(token, expectedAction);
    } else {
      // Standard reCAPTCHA verification
      verifyStandardRecaptcha(token);
    }
  }

  private void verifyEnterpriseRecaptcha(String token, String expectedAction) {
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
      Map<String, Object> event =
          Map.of("token", token, "siteKey", siteKey, "expectedAction", expectedAction);
      Map<String, Object> requestBody = Map.of("event", event);

      RequestEntity<Map<String, Object>> request = RequestEntity.post(uri).body(requestBody);
      ResponseEntity<Map> response = restTemplate.exchange(request, Map.class);

      if (!response.getStatusCode().is2xxSuccessful()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed");
      }

      Map<String, Object> responseBody = response.getBody();
      if (responseBody == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed: Empty response");
      }

      Map<String, Object> riskAnalysis = (Map<String, Object>) responseBody.get("riskAnalysis");
      if (riskAnalysis == null) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed: No risk analysis");
      }

      var score = riskAnalysis.get("score");
      if (score != null) {
        if (Double.parseDouble(score.toString()) < 0.5) {
          throw new ResponseStatusException(
              HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed: Low score");
        }
      }
    } catch (Exception e) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed: " + e.getMessage());
    }
  }

  private void verifyStandardRecaptcha(String token) {
    try {
      URI uri =
          UriComponentsBuilder.fromUriString("https://www.google.com/recaptcha/api/siteverify")
              .queryParam("secret", recaptchaSecret)
              .queryParam("response", token)
              .build()
              .toUri();

      RequestEntity<Void> request = RequestEntity.post(uri).build();
      ResponseEntity<Map> response = restTemplate.exchange(request, Map.class);

      if (!response.getStatusCode().is2xxSuccessful()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed");
      }

      Map<String, Object> responseBody = response.getBody();
      if (responseBody == null || !Boolean.TRUE.equals(responseBody.get("success"))) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed");
      }
    } catch (Exception e) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "reCAPTCHA verification failed: " + e.getMessage());
    }
  }
}
