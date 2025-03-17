This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

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
