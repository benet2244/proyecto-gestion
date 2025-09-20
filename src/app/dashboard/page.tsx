import DetectionsPriorityChart from '@/components/dashboard/detections-priority-chart';
import StatsCards from '@/components/dashboard/stats-cards';
import DetectionsTable from '@/components/detections/detections-table';
import { sampleThreatLogs } from '@/lib/data/threats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Incident, Detection, NewsArticle } from '@/lib/definitions';
import { getNewsArticles } from '@/lib/data';


// In a real app, this data would be fetched from your API
async function getDashboardData() {
  // For now, we simulate fetching from an API. In a real app, you would use fetch()
  // const incidentsRes = await fetch('http://localhost:9002/api/incidents', { cache: 'no-store' });
  // const detectionsRes = await fetch('http://localhost:9002/api/detections', { cache: 'no-store' });
  // const incidents = await incidentsRes.json();
  // const detections = await detectionsRes.json();
  const { getIncidents, getDetections } = await import('@/lib/data');
  const incidents = getIncidents();
  const detections = getDetections();
  return { incidents, detections };
}

export default async function DashboardPage() {
  const { incidents, detections } = await getDashboardData();
  const recentDetections = [...detections].sort((a, b) => new Date(b.fecha_incidente).getTime() - new Date(a.fecha_incidente).getTime()).slice(0, 5);
  const monthlyThreats = sampleThreatLogs.find(log => log.year === 2025 && log.month === 9)?.entries.reduce((sum, entry) => sum + entry.total, 0) || 0;
  
  const allNews = await getNewsArticles();
  const recentNews = allNews.slice(0, 3);

  return (
    <div className="space-y-6">
      <StatsCards incidents={incidents} detections={detections} totalThreats={monthlyThreats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <DetectionsPriorityChart detections={detections} />
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Recent News</CardTitle>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/news">View All</Link>
                </Button>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                 {recentNews.map(article => (
                    <div key={article.id} className='text-sm'>
                         <img src={article.imageUrl} alt={article.title} className="aspect-[16/9] w-full rounded-md object-cover mb-2" />
                        <p className="font-semibold mb-1 leading-tight hover:underline">
                            <Link href={article.url} target="_blank">{article.title}</Link>
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {article.source} &middot; {new Date(article.publishedAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </CardContent>
           </Card>
        </div>
        <div className="lg:col-span-2">
            <h2 className="text-xl font-headline mb-4">Recent Detections</h2>
            <DetectionsTable detections={recentDetections} isDashboard={true} />
        </div>
      </div>
    </div>
  );
}
