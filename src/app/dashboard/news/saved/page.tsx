import NewsList from '@/components/news/news-list';
import { newsArticles } from '@/lib/data';
import { NewsArticle } from '@/lib/definitions';

// In a real app, this would be fetched from a user-specific store
const getSavedArticles = async (): Promise<NewsArticle[]> => {
    // For this example, we'll just use all articles as if they were saved
    // to demonstrate the functionality.
    return newsArticles.slice(0, 2); 
}

export default async function SavedNewsPage() {
  const savedArticlesData = await getSavedArticles();

  return (
    <div>
      <h1 className="text-2xl font-headline mb-4">Saved News</h1>
      <NewsList articles={newsArticles} savedArticles={savedArticlesData} isSavedNewsPage={true} />
    </div>
  );
}
