package io.mpj.webpigram.epigram.interactions;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AnonymousInteractionRequest(
    @NotNull(message = "Epigram ID is required") @Positive(message = "Epigram ID must be positive")
        Long epigramId,
    @NotNull(message = "Interaction type is required") InteractionType interactionType,

    // Optional comment content, required only for COMMENT interaction type
    String commentContent,
    @NotBlank(message = "reCAPTCHA token is required") String recaptchaToken) {}
