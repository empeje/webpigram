# High-Level Application Features

Webpigram is a web application that allows users to
- Generate random epigram
  - Based on database of fortunes
  - AI Generated
- Submit user generated epigrams
  - Not authenticated - only using captcha (in dev captcha is bypassed)
- Epigram retrieval
  - In addition to retrieving a single epigram from the database randomly, we have a `/feeds` endpoint that returns a combination of most popular epigrams and recently added epigrams
- Epigram moderation
  - For development use case we can bypass moderation
  - For production use case - all epigrams are moderated
    - There are two ways to moderate epigrams
      - Manual moderation
      - AI moderation
  - Moderation mode is configurable using system properties (NONE, AI, MANUAL)
- Epigram deletion
  - There's a button to report epigrams that are offensive. This reports arrive at the moderation queue

# Application Architecture

## 1. Domain: `epigram`

- Handles core epigram-related features like creation, retrieval, and management.

**Modules:**

- `epigram-generation`
  - Generate random epigrams. Technically we are retrieving epigrams from a database. Call it "generate" as it is frequently used in conversation.
  - Handle both database-based and AI-generated epigrams.

- `epigram-submission`
  - Allow users to submit epigrams.
  - Implement and manage CAPTCHA (or bypass it in development).

- `epigram-feeds`
  - `/feeds` endpoint for combined most popular and recently added epigrams.

---

## 2. Domain: `user`

- Focuses on user interactions like submissions, reporting, and content management.

**Modules:**

- `user-action`
  - User-initiated actions like submitting or reporting epigrams.

---

## 3. Domain: `moderation`

- Manages the moderation pipeline.

**Modules:**

- `manual-moderation`
  - Handle manual moderation of epigrams.

- `ai-moderation`
  - Implement AI moderation.

- `moderation-config`
  - Configure moderation mode via system properties (`NONE`, `AI`, `MANUAL`).

- `report-handling`
  - Handle reported epigrams for review in the moderation queue.

---

## 4. Domain: `infrastructure`

- Manages application infrastructure and tools.

**Modules:**

- `configuration`
  - System properties, application configuration, and moderation settings for production or development contexts.

- `logging`
  - Application logging and error capturing.

- `captcha`
  - Manages CAPTCHA functionality or development bypass logic.

---