import DetectionsPriorityChart from '@/components/dashboard/detections-priority-chart';
import StatsCards from '@/components/dashboard/stats-cards';
import DetectionsTable from '@/components/detections/detections-table';
import { incidents, detections } from '@/lib/data';
import { sampleThreatLogs } from '@/lib/data/threats';

export default function DashboardPage() {
  const recentDetections = [...detections].sort((a, b) => new Date(b.fecha_incidente).getTime() - new Date(a.fecha_incidente).getTime()).slice(0, 5);

  const monthlyThreats = sampleThreatLogs.find(log => log.year === 2025 && log.month === 9)?.entries.reduce((sum, entry) => sum + entry.total, 0) || 0;

  return (
    <div className="space-y-6">
      <StatsCards incidents={incidents} detections={detections} totalThreats={monthlyThreats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DetectionsPriorityChart detections={detections} />
        </div>
        <div className="lg:col-span-2">
            <h2 className="text-xl font-headline mb-4">Recent Detections</h2>
            <DetectionsTable detections={recentDetections} isDashboard={true} />
        </div>
      </div>
    </div>
  );
}
