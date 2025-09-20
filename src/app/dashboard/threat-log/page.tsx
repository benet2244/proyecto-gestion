import { Button } from '@/components/ui/button';
import { PlusCircle, Download, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

import ThreatLogTable from '@/components/threat-log/threat-log-table';
import { getThreatLogs } from '@/lib/actions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default async function ThreatLogPage() {
  const threatLogs = await getThreatLogs();
  
  const csvExportUrl = `${API_BASE_URL}/export_detections.php`;
  const sqlBackupUrl = `${API_BASE_URL}/backup_detections.php`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            {/* Espacio reservado para futuros filtros */}
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <a href={csvExportUrl} download>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar CSV
                </a>
            </Button>

            <Button variant="secondary" asChild>
                <a href={sqlBackupUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Backup
                </a>
            </Button>

            <Button asChild>
                <Link href="/dashboard/threat-log/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nuevo Registro
                </Link>
            </Button>
        </div>
      </div>
      <ThreatLogTable threatLogs={threatLogs} /> 
    </div>
  );
}
