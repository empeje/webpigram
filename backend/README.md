# Webpigram Backend

This is the backend component of the Webpigram application. For general project information and setup instructions, please refer to the [main README](../README.md).

## Getting Started

### Prerequisites

- Java 23 or higher
- Maven
- PostgreSQL database (can be run using Docker Compose from the root directory)

### Running the Backend

From the root directory, you can use the following commands:

```bash
# Start the backend in development mode
just dev-backend

# Start the backend with fortune loader enabled
just dev-backend-with-fortune
```

Alternatively, you can run the backend directly:

```bash
# From the backend directory
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# With fortune loader enabled
./mvnw spring-boot:run -Dspring-boot.run.arguments="--app.fortune-loader.enabled=true" -Dspring-boot.run.profiles=dev
```

The backend will be available at http://localhost:8080.

## High-Level Application Features

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

## Application Architecture

### 1. Domain: `epigram`

- Handles core epigram-related features like creation, retrieval, and management.

**Modules:**

- `epigram-generation`
  - Generate random epigrams. Technically we are retrieving epigrams from a database. Call it "generate" as it is frequently used in conversation. ✅
  - Handle both database-based and AI-generated epigrams.

- `epigram-submission`
  - Allow users to submit epigrams. ✅
  - Implement and manage CAPTCHA (or bypass it in development). ✅

- `epigram-feeds`
  - `/feeds` endpoint for combined most popular and recently added epigrams. ✅

### 2. Domain: `user`

- Focuses on user interactions like submissions, reporting, and content management.

**Modules:**

- `user-action`
  - User-initiated actions like submitting or reporting epigrams.

### 3. Domain: `moderation`

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

### 4. Domain: `infrastructure`

- Manages application infrastructure and tools.

**Modules:**

- `configuration`
  - System properties, application configuration, and moderation settings for production or development contexts.

- `logging`
  - Application logging and error capturing.

- `captcha`
  - Manages CAPTCHA functionality or development bypass logic.

## reCAPTCHA Configuration

The application uses Google reCAPTCHA for spam protection. By default, it's configured to use reCAPTCHA Enterprise, but it can also work with standard reCAPTCHA v2/v3.

### reCAPTCHA Enterprise (Default)

To configure reCAPTCHA Enterprise:

1. Create a project in Google Cloud Platform
2. Enable the reCAPTCHA Enterprise API
3. Create a reCAPTCHA Enterprise key
4. Set the following environment variables:

```
RECAPTCHA_ENABLED=true
RECAPTCHA_SECRET_KEY=your_api_key
RECAPTCHA_PROJECT_ID=your_gcp_project_id
RECAPTCHA_ENTERPRISE=true
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

For the frontend (in `.env.local`):
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Important Note**: The `RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` are different:
- `RECAPTCHA_SITE_KEY` is the key used in the frontend to render the reCAPTCHA widget
- `RECAPTCHA_SECRET_KEY` is the API key used to authenticate API calls to the reCAPTCHA Enterprise API

### Standard reCAPTCHA (v2/v3)

If you prefer to use standard reCAPTCHA instead of Enterprise:

1. Register your site at [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Set the following environment variables:

```
RECAPTCHA_ENABLED=true
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
RECAPTCHA_ENTERPRISE=false
```

For the frontend (in `.env.local`):
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Development/Testing

For development/testing purposes, you can bypass the captcha.

Note: These test keys will always pass verification regardless of user input, but they only work with standard reCAPTCHA, not with Enterprise.

## Additional Documentation

- [Code Quality Tools](README-TOOLS.md) - Information about the code quality tools used in this project
- [Fortune Loader](src/main/java/io/mpj/webpigram/tools/README.md) - Documentation for the Fortune Loader tool