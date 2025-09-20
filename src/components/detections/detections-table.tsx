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
import { Detection } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DetectionsTableProps {
  detections: Detection[];
}

const threatLevelVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'No Detectado': 'secondary',
  'Bajo': 'secondary',
  'Medio': 'default',
  'Alto': 'destructive',
  'Crítico': 'destructive',
};

export default function DetectionsTable({ detections }: DetectionsTableProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    // This will be implemented later
    // router.push(`/dashboard/detections/${id}`);
    console.log("View details for", id)
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Detections</CardTitle>
        <CardDescription>
          A list of all cybersecurity detections.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Equipo Afectado</TableHead>
              <TableHead>Nivel de Amenaza</TableHead>
              <TableHead>Dependencia</TableHead>
              <TableHead>Tipo de Incidente</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {detections.map((detection) => (
              <TableRow key={detection.id}>
                <TableCell>
                  <div className="font-medium">{detection.equipo_afectado}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={threatLevelVariant[detection.nivel_amenaza] || 'default'} className={cn(detection.nivel_amenaza === "Medio" && "bg-yellow-500 text-white")}>
                    {detection.nivel_amenaza}
                  </Badge>
                </TableCell>
                <TableCell>
                    {detection.dependencia}
                </TableCell>
                 <TableCell>
                    {detection.tipo_incidente}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(detection.id)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        {/* <Link href={`/dashboard/detections/${detection.id}/edit`}>Edit</Link> */}
                         <Link href={`#`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{detections.length}</strong> of <strong>{detections.length}</strong> detections
        </div>
      </CardFooter>
    </Card>
  );
}
