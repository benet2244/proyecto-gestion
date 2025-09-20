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
import { Incident } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface IncidentsTableProps {
  incidents: Incident[];
  isDashboard?: boolean;
}

const severityVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Low: 'secondary',
  Medium: 'default',
  High: 'destructive',
  Critical: 'destructive',
};

const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Open: 'default',
  'In Progress': 'default',
  Closed: 'secondary',
  Resolved: 'secondary',
};

export default function IncidentsTable({ incidents, isDashboard = false }: IncidentsTableProps) {
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/incidents/${id}`);
  };

  const TableContent = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Incident</TableHead>
          {!isDashboard && <TableHead>Reported At</TableHead>}
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell>
              <div className="font-medium">{incident.title}</div>
              {!isDashboard && <div className="text-sm text-muted-foreground">{incident.id}</div>}
            </TableCell>
            {!isDashboard && <TableCell>{new Date(incident.reportedAt).toLocaleDateString()}</TableCell>}
            <TableCell>
              <Badge variant={severityVariant[incident.severity] || 'default'} className={cn(incident.severity === "Medium" && "bg-yellow-500 text-white")}>
                {incident.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[incident.status] || 'default'} className={cn(incident.status === "In Progress" ? "bg-blue-500 text-white" : "", incident.status === "Open" ? "bg-green-500 text-white" : "")}>
                {incident.status}
              </Badge>
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
                  <DropdownMenuItem onClick={() => handleViewDetails(incident.id)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/incidents/${incident.id}/edit`}>Edit</Link>
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
        <CardTitle className="font-headline">All Incidents</CardTitle>
        <CardDescription>
          A list of all cybersecurity incidents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableContent />
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{incidents.length}</strong> of <strong>{incidents.length}</strong> incidents
        </div>
      </CardFooter>
    </Card>
  );
}
