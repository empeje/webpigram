package io.mpj.webpigram.epigram.submission;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/epigram")
public class SubmissionController {

  private final SubmissionService submissionService;

  public SubmissionController(SubmissionService submissionService) {
    this.submissionService = submissionService;
  }

  @PostMapping("/submit")
  public ResponseEntity<SubmissionResponse> submitEpigram(
      @Valid @RequestBody SubmissionRequest request) {
    long epigramId = submissionService.submitEpigram(request);
    return ResponseEntity.ok(new SubmissionResponse(epigramId, "Epigram submitted successfully"));
  }
}
