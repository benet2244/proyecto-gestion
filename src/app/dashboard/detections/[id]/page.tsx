import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Detection } from '@/lib/definitions';
import DeleteButton from '@/components/shared/delete-button';
import { format } from 'date-fns';

async function getDetection(id: string): Promise<Detection | null> {
    const res = await fetch(`http://localhost:9002/api/detections/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}


const threatLevelVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'No Detectado': 'secondary',
  'Bajo': 'secondary',
  'Medio': 'default',
  'Alto': 'destructive',
  'Crítico': 'destructive',
  'Desconocido': 'outline',
};

export default async function DetectionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const detection = await getDetection(params.id);

  if (!detection) {
    return <p>Detection not found.</p>;
  }

  const priorityVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'Baja': 'secondary',
    'Media': 'default',
    'Alta': 'destructive',
    'Crítica': 'destructive',
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/detections">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Detection: {detection.id}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
             <Link href={`/dashboard/detections/${detection.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
             </Link>
          </Button>
          <DeleteButton id={detection.id} type="detection" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detection Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Tipo de Incidente</span>
                        <span className="font-medium">{detection.tipo_incidente}</span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Equipo Afectado</span>
                        <span className="font-medium">{detection.equipo_afectado}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Dependencia</span>
                        <span className="font-medium">{detection.dependencia}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Dirección MAC</span>
                        <span className="font-medium">{detection.direccion_mac}</span>
                    </div>
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Acciones y Detalles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-1">Acciones Tomadas</h4>
                    <p className="text-sm text-muted-foreground">{detection.acciones_tomadas}</p>
                </div>
                 <div>
                    <h4 className="font-medium mb-1">Detalles Adicionales</h4>
                    <p className="text-sm text-muted-foreground">{detection.detalles}</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Análisis y Estado</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estado</span>
                    <span><Badge>{detection.estado}</Badge></span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Prioridad</span>
                    <span><Badge variant={priorityVariant[detection.prioridad]}>{detection.prioridad}</Badge></span>
                </div>
                <Separator />
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estado del Equipo</span>
                    <span><Badge variant={detection.estado_equipo === 'Infectado' ? 'destructive' : 'secondary'}>{detection.estado_equipo}</Badge></span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nivel de Amenaza</span>
                     <span>
                        <Badge variant={threatLevelVariant[detection.nivel_amenaza] || 'default'} className={cn(detection.nivel_amenaza === "Medio" && "bg-yellow-500 text-white")}>
                            {detection.nivel_amenaza}
                        </Badge>
                    </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Hash Analizado</span>
                    <span className="font-mono text-xs break-all">{detection.hash || 'N/A'}</span>
                </div>
                <Separator />
                 <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Fecha de Incidente</span>
                    <span>{format(new Date(detection.fecha_incidente), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Responsable</span>
                    <span>{detection.responsable}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
