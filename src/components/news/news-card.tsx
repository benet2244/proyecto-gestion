
'use client';

import Image from 'next/image';
import { Bookmark, FileText, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NewsArticle } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface NewsCardProps {
  article: NewsArticle;
  onSummarize: (article: NewsArticle) => void;
  onSave: (article: NewsArticle) => void;
  isSaved?: boolean;
}

export default function NewsCard({ article, onSummarize, onSave, isSaved }: NewsCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint={article.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge variant="outline" className="mb-2">{article.category}</Badge>
        <CardTitle className="mb-2 font-headline text-lg leading-tight">
          {article.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {article.source} &middot; {new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => onSave(article)}>
                <Bookmark className={`mr-2 h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onSummarize(article)}>
                <FileText className="mr-2 h-4 w-4" />
                Summarize
            </Button>
        </div>
        <Button variant="ghost" size="icon" asChild>
            <Link href={article.url} target="_blank" aria-label={`Read full article: ${article.title}`}>
                <ExternalLink className="h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
