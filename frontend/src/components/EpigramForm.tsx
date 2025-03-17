import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Epigram } from '@/types/epigram';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Define the global grecaptcha type
declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  author: z.string().min(1, 'Author is required'),
  topics: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EpigramFormProps {
  onSubmit: (
    epigram: Omit<Epigram, 'id' | 'upvotes' | 'downvotes' | 'createdAt'> & {
      recaptchaToken: string;
    }
  ) => void;
}

export function EpigramForm({ onSubmit }: EpigramFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  // Load reCAPTCHA script
  useEffect(() => {
    // Skip if already loaded or no site key
    if (
      window.grecaptcha ||
      !siteKey ||
      document.querySelector('script[src*="recaptcha/enterprise.js"]')
    ) {
      setRecaptchaLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setRecaptchaLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load reCAPTCHA');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      document.head.removeChild(script);
    };
  }, [siteKey]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      author: '',
      topics: '',
    },
  });

  const executeRecaptcha = async (): Promise<string | null> => {
    if (!recaptchaLoaded || !window.grecaptcha?.enterprise) {
      setError('reCAPTCHA is not loaded yet. Please try again.');
      return null;
    }

    try {
      return await new Promise((resolve, reject) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, {
              action: 'SUBMIT_EPIGRAM',
            });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      setError('reCAPTCHA verification failed. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Execute reCAPTCHA and get token
      const token = await executeRecaptcha();
      if (!token) {
        setIsSubmitting(false);
        return;
      }

      // Process topics from comma-separated string to array
      const topicsArray = values.topics
        ? values.topics
            .split(',')
            .map(topic => topic.trim())
            .filter(Boolean)
        : [];

      // Create a new epigram object
      const newEpigram = {
        content: values.content,
        author: values.author,
        topics: topicsArray,
        recaptchaToken: token,
      };

      // Call the onSubmit callback
      await onSubmit(newEpigram);

      // Reset the form
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit epigram');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Epigram</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your epigram..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <Input placeholder="Programming, Variables, etc. (comma-separated)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !recaptchaLoaded}>
          {isSubmitting ? 'Submitting...' : 'Submit Epigram'}
        </Button>
      </form>
    </Form>
  );
}
