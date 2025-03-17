package io.mpj.webpigram.epigram.anonymous;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/epigram/interaction")
public class AnonymousInteractionController {
  private final AnonymousInteractionService interactionService;

  public AnonymousInteractionController(AnonymousInteractionService interactionService) {
    this.interactionService = interactionService;
  }

  @PostMapping
  public ResponseEntity<AnonymousInteractionResponse> processInteraction(
      @Valid @RequestBody AnonymousInteractionRequest request, HttpServletRequest httpRequest) {
    AnonymousInteractionResponse response =
        interactionService.processInteraction(request, httpRequest);
    return ResponseEntity.ok(response);
  }

  @GetMapping("/comments/{epigramId}")
  public ResponseEntity<CommentResponse> getCommentsForEpigram(
      @PathVariable("epigramId") long epigramId) {
    CommentResponse response = interactionService.getCommentsForEpigram(epigramId);
    return ResponseEntity.ok(response);
  }
}
