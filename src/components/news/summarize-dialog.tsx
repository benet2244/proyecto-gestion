'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { NewsArticle } from '@/lib/definitions';
import { summarizeCybersecurityNews } from '@/ai/flows/summarize-cybersecurity-news';
import { Skeleton } from '../ui/skeleton';
import { Sparkles } from 'lucide-react';

interface SummarizeDialogProps {
  article: NewsArticle;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SummarizeDialog({
  article,
  isOpen,
  onOpenChange,
}: SummarizeDialogProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !summary) {
      const getSummary = async () => {
        setIsLoading(true);
        try {
          const result = await summarizeCybersecurityNews({
            articleContent: article.content,
          });
          setSummary(result.summary);
        } catch (error) {
          console.error('Failed to summarize article:', error);
          setSummary('Sorry, we were unable to generate a summary at this time.');
        } finally {
          setIsLoading(false);
        }
      };
      getSummary();
    } else if (!isOpen) {
        // Reset summary when dialog closes
        setSummary(null);
    }
  }, [isOpen, article, summary]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Summary
            </DialogTitle>
          <DialogDescription>{article.title}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {summary && <p className="text-sm leading-relaxed">{summary}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
