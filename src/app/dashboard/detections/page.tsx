import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import DetectionsTable from '@/components/detections/detections-table';
import { detections } from '@/lib/data';

export default function DetectionsPage() {
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
