import { Button } from '@/components/ui/button';
import { PlusCircle, Download, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

import DetectionsTable from '@/components/detections/detections-table';
import { getDetections } from '@/lib/actions';

// URL pública para los enlaces que usará el navegador
const PUBLIC_API_URL = "http://localhost:8080/backend";

export default async function DetectionsPage() {
  // Obtener datos desde el backend de PHP (comunicación servidor a servidor)
  const detections = await getDetections();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            {/* Espacio reservado para futuros filtros */}
        </div>
        <div className="flex gap-2">
            {/* Botón para exportar a CSV (usado por el navegador) */}
            <Button variant="outline" asChild>
                <a href={`${PUBLIC_API_URL}/export_detections.php`} target="_blank">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar CSV
                </a>
            </Button>

            {/* Botón para descargar backup (usado por el navegador) */}
            <Button variant="secondary" asChild>
                <a href={`${PUBLIC_API_URL}/backup_detections.php`} target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Backup
                </a>
            </Button>

            {/* Botón para crear nueva detección */}
            <Button asChild>
                <Link href="/dashboard/detections/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nueva Detección
                </Link>
            </Button>
        </div>
      </div>
      {/* Pasar los datos reales a la tabla */}
      <DetectionsTable detections={detections} />
    </div>
  );
}
