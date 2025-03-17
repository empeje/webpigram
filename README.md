# Webpigram

Webpigram is a web application that allows users to generate, view, and submit epigrams (short, witty sayings).

## TL;DR: Quick Start

### Prerequisites

- [just](https://github.com/casey/just) - Command runner for project-specific tasks  
  Install using Homebrew: `brew install just`  
  For other installation methods or more details, see the [official repository](https://github.com/casey/just)
- Java 23+ for backend
- Node.js and pnpm for frontend
- Docker and Docker Compose (for PostgreSQL database)

### Live Demo

Visit the live demo at https://webpigram.vercel.app (Note: The site uses a free instance that requires cold start on first boot)

### Setup

```bash
# Clone the repository with submodules
git clone --recurse-submodules https://github.com/empeje/webpigram.git
cd webpigram

# Set up the project (installs dependencies)
just setup

# Start PostgreSQL database
docker-compose up -d

# Run both backend and frontend in development mode
just dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Project Structure

- **Backend**: Spring Boot application in the `backend/` directory
- **Frontend**: Next.js application in the `frontend/` directory
- **Fortune-OSX**: Submodule containing fortune data used to populate the database

## Detailed Documentation

- [Backend Documentation](backend/README.md) - Details on backend architecture, features, and configuration
- [Frontend Documentation](frontend/README.md) - Information on frontend setup, environment variables, and deployment
- [Backend Tools Documentation](backend/README-TOOLS.md) - Code quality tools used in the backend
- [Fortune Loader Documentation](backend/src/main/java/io/mpj/webpigram/tools/README.md) - Tool for loading fortune data into the database

## Development Commands

```bash
# Run backend only
just dev-backend

# Run frontend only
just dev-frontend

# Run backend with fortune loader enabled
just dev-backend-with-fortune

# Build the entire application
just build

# Run tests
just test
```

## Features

- Generate random epigrams from a database of fortunes
- AI-generated epigrams
- User submission of epigrams with CAPTCHA protection
- Epigram feeds combining popular and recent content
- Moderation system (manual or AI-based)
- Reporting functionality for inappropriate content

## Deployment

The application can be deployed using Docker. A Dockerfile is provided in the root directory.

## Environment Variables

See the backend and frontend README files for details on required environment variables.
