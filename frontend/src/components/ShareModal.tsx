'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy } from 'lucide-react';
import { Epigram } from '@/types/epigram';

interface ShareModalProps {
  epigram: Epigram;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ epigram, isOpen, onOpenChange }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/epigram/${epigram.id}`
      : `/epigram/${epigram.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Epigram</DialogTitle>
          <DialogDescription>
            Copy the link below to share this epigram with others.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input readOnly value={shareUrl} className="w-full" />
          </div>
          <Button type="button" size="icon" onClick={handleCopy} variant="outline" className="px-3">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
