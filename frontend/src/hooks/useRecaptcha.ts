import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useRecaptcha() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const { toast } = useToast();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  // Load reCAPTCHA script
  useEffect(() => {
    if (window.grecaptcha || document.querySelector('script[src*="recaptcha/enterprise.js"]')) {
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
      toast({
        title: 'Error',
        description: 'Failed to load reCAPTCHA',
        variant: 'destructive',
      });
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [siteKey, toast]);

  // Execute reCAPTCHA and get token
  const executeRecaptcha = async (action: string = 'INTERACTION'): Promise<string | null> => {
    if (!recaptchaLoaded || !window.grecaptcha?.enterprise) {
      toast({
        title: 'Error',
        description: 'reCAPTCHA is not loaded yet. Please try again.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      return new Promise((resolve, reject) => {
        window.grecaptcha.enterprise.ready(async () => {
          try {
            const token = await window.grecaptcha.enterprise.execute(siteKey, {
              action,
            });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      toast({
        title: 'Error',
        description: 'reCAPTCHA verification failed. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    recaptchaLoaded,
    executeRecaptcha,
  };
}
