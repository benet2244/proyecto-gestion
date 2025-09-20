import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import IncidentsTable from '@/components/incidents/incidents-table';
import { Incident } from '@/lib/definitions';

async function getIncidentsData(): Promise<Incident[]> {
  // In a real app, this fetch would go to an absolute URL of your deployed backend.
  // const res = await fetch('http://localhost:9002/api/incidents', { cache: 'no-store' });
  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error('Failed to fetch data')
  // }
  // return res.json();
  
  // For this example, we'll import from the data file directly.
  const { getIncidents } = await import('@/lib/data');
  return getIncidents();
}

export default async function IncidentsPage() {
  const incidents = await getIncidentsData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            {/* Can be used for filters in future */}
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Export PDF</Button>
            <Button variant="outline">Export Excel</Button>
            <Button asChild>
                <Link href="/dashboard/incidents/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Incident
                </Link>
            </Button>
        </div>
      </div>
      <IncidentsTable incidents={incidents} />
    </div>
  );
}
