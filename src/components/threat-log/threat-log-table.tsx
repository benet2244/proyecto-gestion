'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ThreatLog } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import DeleteButton from '@/components/shared/delete-button';
import React from 'react';

interface ThreatLogTableProps {
  threatLogs: ThreatLog[];
  isDashboard?: boolean;
}

const threatLevelVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'No Detectado': 'secondary',
  'Bajo': 'secondary',
  'Medio': 'default',
  'Alto': 'destructive',
  'Crítico': 'destructive',
};

export default function ThreatLogTable({ threatLogs, isDashboard = false }: ThreatLogTableProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/threat-log/${id}`);
  };

  const TableContent = () => (
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipo Afectado</TableHead>
          <TableHead>Nivel de Amenaza</TableHead>
          {!isDashboard && <TableHead>Dependencia</TableHead>}
          {!isDashboard && <TableHead>Tipo de Incidente</TableHead>}
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threatLogs.map((threatLog) => (
          <TableRow key={threatLog.id}>
            <TableCell>
              <div className="font-medium">{threatLog.equipo_afectado}</div>
            </TableCell>
            <TableCell>
              <Badge variant={threatLevelVariant[threatLog.nivel_amenaza] || 'default'} className={cn(threatLog.nivel_amenaza === "Medio" && "bg-yellow-500 text-white")}>
                {threatLog.nivel_amenaza}
              </Badge>
            </TableCell>
            {!isDashboard && <TableCell>{threatLog.dependencia}</TableCell>}
            {!isDashboard && <TableCell>{threatLog.tipo_incidente}</TableCell>}
            <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(threatLog.id)}>
                      Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/threat-log/${threatLog.id}/edit`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <DeleteButton id={threatLog.id} type="threat-log" asDropdownMenuItem />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isDashboard) {
    return (
        <Card>
            <CardContent className="p-0">
                <TableContent />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Todos los Registros de Amenazas</CardTitle>
        <CardDescription>
          Una lista de todos los registros de amenazas de ciberseguridad.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableContent />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>1-{threatLogs.length}</strong> de <strong>{threatLogs.length}</strong> registros
        </div>
      </CardFooter>
    </Card>
  );
}
