package io.mpj.webpigram.epigram.submission;

import com.google.common.collect.ImmutableList;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SubmissionRequest(
    @NotBlank(message = "Content is required")
        @Size(min = 1, max = 500, message = "Content must be between 1 and 500 characters")
        String content,
    @NotBlank(message = "Author is required")
        @Size(min = 1, max = 100, message = "Author must be between 1 and 100 characters")
        String author,
    @NotEmpty(message = "At least one topic is required") List<String> topics,
    @NotBlank(message = "reCAPTCHA token is required") String recaptchaToken) {
  public ImmutableList<String> getTopicsAsList() {
    return ImmutableList.copyOf(topics);
  }
}
