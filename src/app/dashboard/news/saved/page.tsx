import NewsList from '@/components/news/news-list';
import { getNewsArticles } from '@/lib/data';
import { NewsArticle } from '@/lib/definitions';

// In a real app, this would be fetched from a user-specific store
const getSavedArticles = async (): Promise<NewsArticle[]> => {
    // This should ideally come from a user-specific database.
    // For this example, we'll just use a few articles as if they were saved
    // to demonstrate the functionality.
    const allArticles = await getNewsArticles();
    return allArticles.slice(0, 2); 
}

export default async function SavedNewsPage() {
  const savedArticlesData = await getSavedArticles();
  const allArticles = await getNewsArticles();

  return (
    <div>
      <h1 className="text-2xl font-headline mb-4">Saved News</h1>
      <NewsList articles={allArticles} savedArticles={savedArticlesData} isSavedNewsPage={true} />
    </div>
  );
}
