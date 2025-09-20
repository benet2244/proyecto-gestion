import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import IncidentsTable from '@/components/incidents/incidents-table';
import { Incident } from '@/lib/definitions';

async function getIncidentsData(): Promise<Incident[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/api/incidents`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
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
