import { Button } from '@/components/ui/button';
import { PlusCircle, Download } from 'lucide-react';
import Link from 'next/link';

import DetectionsTable from '@/components/detections/detections-table';
import { Detection } from '@/lib/definitions';

async function getDetectionsData(): Promise<Detection[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const res = await fetch(`${baseUrl}/api/detections`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch detections');
  }
  return res.json();
}


export default async function DetectionsPage() {
  const detections = await getDetectionsData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            {/* Can be used for filters in future */}
        </div>
        <div className="flex gap-2">
            <Button variant="outline">Export PDF</Button>
            <Button variant="outline">Export Excel</Button>
            <Button variant="secondary" asChild>
                <Link href="/api/backup">
                    <Download className="mr-2 h-4 w-4" />
                    Download Backup
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/detections/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Detection
                </Link>
            </Button>
        </div>
      </div>
      <DetectionsTable detections={detections} />
    </div>
  );
}
