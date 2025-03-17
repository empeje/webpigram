# Webpigram Frontend

This is the frontend component of the Webpigram application. For general project information and setup instructions, please refer to the [main README](../README.md).

## Getting Started

### Prerequisites

- Node.js
- pnpm (preferred) or npm/yarn

### Running the Frontend

From the root directory, you can use the following command:

```bash
# Start the frontend in development mode
just dev-frontend
```

Alternatively, you can run the frontend directly:

```bash
# From the frontend directory
pnpm install  # Only needed the first time
pnpm dev
```

The frontend will be available at http://localhost:3000.

## Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```
# API Configuration
API_URL=http://localhost:8080

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### reCAPTCHA Configuration

The application uses Google reCAPTCHA for spam protection in the epigram submission form. By default, it's configured to use reCAPTCHA Enterprise, but it can also work with standard reCAPTCHA.

#### reCAPTCHA Enterprise (Recommended)

To configure reCAPTCHA Enterprise:

1. Create a project in Google Cloud Platform
2. Enable the reCAPTCHA Enterprise API
3. Create a reCAPTCHA Enterprise key
4. Add your site key to the `.env.local` file:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

#### Standard reCAPTCHA

If you prefer to use standard reCAPTCHA:

1. Register your site at [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Add your site key to the `.env.local` file:

```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

Make sure to also update the backend configuration to use standard reCAPTCHA.

#### Development/Testing

For development/testing purposes with standard reCAPTCHA, you can use Google's test key:
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

Note: This test key will always pass verification regardless of user input, but it only works with standard reCAPTCHA, not with Enterprise.

## Learn More

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
