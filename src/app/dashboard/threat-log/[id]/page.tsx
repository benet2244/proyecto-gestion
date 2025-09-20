import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getThreatLogById } from '@/lib/actions';
import DeleteButton from '@/components/shared/delete-button';
import { format } from 'date-fns';

const threatLevelVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'No Detectado': 'secondary',
  'Bajo': 'secondary',
  'Medio': 'default',
  'Alto': 'destructive',
  'Crítico': 'destructive',
  'Desconocido': 'outline',
};

const priorityVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    'Baja': 'secondary',
    'Media': 'default',
    'Alta': 'destructive',
    'Crítica': 'destructive',
};

export default async function ThreatLogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const threatLog = await getThreatLogById(params.id);

  if (!threatLog) {
    return <p>Registro de amenaza no encontrado.</p>;
  }

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/threat-log">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          Registro: {threatLog.id}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
             <Link href={`/dashboard/threat-log/${threatLog.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
             </Link>
          </Button>
          <DeleteButton id={threatLog.id} type="threat-log" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Detalles del Registro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Tipo de Incidente</span>
                        <span className="font-medium">{threatLog.tipo_incidente}</span>
                    </div>
                     <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Equipo Afectado</span>
                        <span className="font-medium">{threatLog.equipo_afectado}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Dependencia</span>
                        <span className="font-medium">{threatLog.dependencia}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Dirección MAC</span>
                        <span className="font-medium">{threatLog.direccion_mac}</span>
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
                    <p className="text-sm text-muted-foreground">{threatLog.acciones_tomadas}</p>
                </div>
                 <div>
                    <h4 className="font-medium mb-1">Detalles Adicionales</h4>
                    <p className="text-sm text-muted-foreground">{threatLog.detalles}</p>
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
                    <span><Badge>{threatLog.estado}</Badge></span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Prioridad</span>
                    <span><Badge variant={priorityVariant[threatLog.prioridad]}>{threatLog.prioridad}</Badge></span>
                </div>
                <Separator />
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estado del Equipo</span>
                    <span><Badge variant={threatLog.estado_equipo === 'Infectado' ? 'destructive' : 'secondary'}>{threatLog.estado_equipo}</Badge></span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Nivel de Amenaza</span>
                     <span>
                        <Badge variant={threatLevelVariant[threatLog.nivel_amenaza] || 'default'} className={cn(threatLog.nivel_amenaza === "Medio" && "bg-yellow-500 text-white")}>
                            {threatLog.nivel_amenaza}
                        </Badge>
                    </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Hash Analizado</span>
                    <span className="font-mono text-xs break-all">{threatLog.hash || 'N/A'}</span>
                </div>
                <Separator />
                 <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Fecha de Incidente</span>
                    <span>{format(new Date(threatLog.fecha_incidente), 'dd/MM/yyyy HH:mm')}</span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Responsable</span>
                    <span>{threatLog.responsable}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
