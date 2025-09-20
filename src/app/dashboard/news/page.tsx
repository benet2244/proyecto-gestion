import NewsList from '@/components/news/news-list';
import { newsArticles } from '@/lib/data';
import { NewsArticle } from '@/lib/definitions';

// In a real app, saved articles would be fetched from a user-specific store
const getSavedArticles = async (): Promise<NewsArticle[]> => {
    return [];
}

export default async function NewsPage() {
    const savedArticles = await getSavedArticles();

  return (
    <div>
      <NewsList articles={newsArticles} savedArticles={savedArticles} />
    </div>
  );
}
