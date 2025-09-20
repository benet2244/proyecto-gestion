import NewsList from '@/components/news/news-list';
import { getNewsArticles } from '@/lib/data';
import { NewsArticle } from '@/lib/definitions';

// In a real app, saved articles would be fetched from a user-specific store
const getSavedArticles = async (): Promise<NewsArticle[]> => {
    // This should ideally come from a user-specific database.
    // For now, we return an empty array.
    return [];
}

export default async function NewsPage() {
    const articles = await getNewsArticles();
    const savedArticles = await getSavedArticles();

  return (
    <div>
      <NewsList articles={articles} savedArticles={savedArticles} />
    </div>
  );
}
