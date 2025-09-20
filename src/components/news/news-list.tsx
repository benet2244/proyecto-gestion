'use client';

import { useState } from 'react';
import { NewsArticle, NewsCategory } from '@/lib/definitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsCard from './news-card';
import SummarizeDialog from './summarize-dialog';
import { useToast } from '@/hooks/use-toast';

interface NewsListProps {
  articles: NewsArticle[];
  savedArticles?: NewsArticle[];
  isSavedNewsPage?: boolean;
}

export default function NewsList({
  articles,
  savedArticles: initialSaved = [],
  isSavedNewsPage = false,
}: NewsListProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isSummarizeOpen, setSummarizeOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>(initialSaved);
  const { toast } = useToast();

  const handleSummarize = (article: NewsArticle) => {
    setSelectedArticle(article);
    setSummarizeOpen(true);
  };

  const handleSave = (article: NewsArticle) => {
    setSavedArticles((prev) => {
      const isAlreadySaved = prev.some((a) => a.id === article.id);
      if (isAlreadySaved) {
        toast({
          title: 'Article Removed',
          description: `"${article.title}" has been removed from your saved list.`,
        });
        return prev.filter((a) => a.id !== article.id);
      } else {
        toast({
          title: 'Article Saved!',
          description: `"${article.title}" has been added to your saved list.`,
        });
        return [...prev, article];
      }
    });
  };

  const categories: NewsCategory[] = [
    'vulnerabilities',
    'patches',
    'malware',
    'threats',
    'general',
  ];

  const articlesToDisplay = isSavedNewsPage ? savedArticles : articles;

  return (
    <>
      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {articlesToDisplay
                .filter((article) => article.category === category)
                .map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    onSummarize={handleSummarize}
                    onSave={handleSave}
                    isSaved={savedArticles.some((a) => a.id === article.id)}
                  />
                ))}
            </div>
             {articlesToDisplay.filter((article) => article.category === category).length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No articles in this category.
                </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      {selectedArticle && (
        <SummarizeDialog
          article={selectedArticle}
          isOpen={isSummarizeOpen}
          onOpenChange={setSummarizeOpen}
        />
      )}
    </>
  );
}
