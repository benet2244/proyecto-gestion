import IncidentsChart from '@/components/dashboard/incidents-chart';
import StatsCards from '@/components/dashboard/stats-cards';
import IncidentsTable from '@/components/incidents/incidents-table';
import { incidents } from '@/lib/data';

export default function DashboardPage() {
  const recentIncidents = [...incidents].sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <StatsCards incidents={incidents} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <IncidentsChart incidents={incidents} />
        </div>
        <div className="lg:col-span-2">
            <h2 className="text-xl font-headline mb-4">Recent Incidents</h2>
            <IncidentsTable incidents={recentIncidents} isDashboard={true} />
        </div>
      </div>
    </div>
  );
}
