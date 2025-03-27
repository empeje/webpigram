package io.mpj.webpigram.epigram.interactions;

import com.google.common.collect.ImmutableList;
import io.mpj.webpigram.config.CaptchaVerificationService;
import io.mpj.webpigram.epigram.feeds.EpigramRepository;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AnonymousInteractionService {
  private final AnonymousInteractionRepository interactionRepository;
  private final EpigramRepository epigramRepository;
  private final CaptchaVerificationService captchaVerificationService;

  public AnonymousInteractionService(
      AnonymousInteractionRepository interactionRepository,
      EpigramRepository epigramRepository,
      CaptchaVerificationService captchaVerificationService) {
    this.interactionRepository = interactionRepository;
    this.epigramRepository = epigramRepository;
    this.captchaVerificationService = captchaVerificationService;
  }

  public AnonymousInteractionResponse processInteraction(
      AnonymousInteractionRequest request, HttpServletRequest httpRequest) {
    // Verify reCAPTCHA if enabled
    captchaVerificationService.verifyRecaptchaIfEnabled(request.recaptchaToken(), "INTERACTION");

    // Verify epigram exists
    if (!epigramRepository.epigramExists(request.epigramId())) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Epigram not found with ID: " + request.epigramId());
    }

    // Hash the IP address for rate limiting and tracking
    String ipHash = hashIpAddress(getClientIp(httpRequest));

    // Process based on interaction type
    switch (request.interactionType()) {
      case UPVOTE:
        return processUpvote(request.epigramId(), ipHash);
      case DOWNVOTE:
        return processDownvote(request.epigramId(), ipHash);
      case COMMENT:
        return processComment(request.epigramId(), request.commentContent(), ipHash);
      default:
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid interaction type");
    }
  }

  private AnonymousInteractionResponse processUpvote(long epigramId, String ipHash) {
    // Check if user has already upvoted this epigram
    if (interactionRepository.hasInteracted(epigramId, ipHash, InteractionType.UPVOTE)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "You have already upvoted this epigram");
    }

    // Add upvote
    interactionRepository.addUpvote(epigramId, ipHash);

    // Get updated vote counts
    long[] voteCounts = interactionRepository.getVoteCounts(epigramId);

    return new AnonymousInteractionResponse(
        true, "Upvote recorded successfully", Optional.empty(), voteCounts[0], voteCounts[1]);
  }

  private AnonymousInteractionResponse processDownvote(long epigramId, String ipHash) {
    // Check if user has already downvoted this epigram
    if (interactionRepository.hasInteracted(epigramId, ipHash, InteractionType.DOWNVOTE)) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "You have already downvoted this epigram");
    }

    // Add downvote
    interactionRepository.addDownvote(epigramId, ipHash);

    // Get updated vote counts
    long[] voteCounts = interactionRepository.getVoteCounts(epigramId);

    return new AnonymousInteractionResponse(
        true, "Downvote recorded successfully", Optional.empty(), voteCounts[0], voteCounts[1]);
  }

  private AnonymousInteractionResponse processComment(
      long epigramId, String content, String ipHash) {
    // Validate comment content
    if (content == null || content.trim().isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Comment content cannot be empty");
    }

    // Add comment
    long commentId = interactionRepository.addComment(epigramId, content, ipHash);

    // Get updated vote counts
    long[] voteCounts = interactionRepository.getVoteCounts(epigramId);

    return new AnonymousInteractionResponse(
        true, "Comment added successfully", Optional.of(commentId), voteCounts[0], voteCounts[1]);
  }

  public CommentResponse getCommentsForEpigram(long epigramId) {
    // Verify epigram exists
    if (!epigramRepository.epigramExists(epigramId)) {
      throw new ResponseStatusException(
          HttpStatus.NOT_FOUND, "Epigram not found with ID: " + epigramId);
    }

    ImmutableList<Comment> comments = interactionRepository.getCommentsForEpigram(epigramId);
    return new CommentResponse(epigramId, comments);
  }

  private String hashIpAddress(String ipAddress) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(ipAddress.getBytes(StandardCharsets.UTF_8));
      StringBuilder hexString = new StringBuilder();
      for (byte b : hash) {
        String hex = Integer.toHexString(0xff & b);
        if (hex.length() == 1) {
          hexString.append('0');
        }
        hexString.append(hex);
      }
      return hexString.toString();
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("Failed to hash IP address", e);
    }
  }

  private String getClientIp(HttpServletRequest request) {
    String xForwardedFor = request.getHeader("X-Forwarded-For");
    if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
      // X-Forwarded-For can contain multiple IPs, the first one is the client's
      return xForwardedFor.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }
}
