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
import { incidents } from '@/lib/data';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function IncidentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const incident = incidents.find((inc) => inc.id === params.id);

  if (!incident) {
    return <p>Incident not found.</p>;
  }

  const severityVariant: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Low: 'secondary',
    Medium: 'default',
    High: 'destructive',
    Critical: 'destructive',
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/incidents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
          {incident.title}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
             <Link href={`/dashboard/incidents/${incident.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
             </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Incident Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{incident.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incident.updates.length > 0 ? incident.updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-sm text-muted-foreground pt-1">
                      {new Date(update.timestamp).toLocaleTimeString()}
                      <br />
                      {new Date(update.timestamp).toLocaleDateString()}
                    </div>
                    <div className="relative">
                      <div className="h-full w-px bg-border absolute left-2 top-2"></div>
                      <div className="w-4 h-4 rounded-full bg-primary border-4 box-content border-background"></div>
                    </div>
                    <p className="flex-1 text-sm">{update.update}</p>
                  </div>
                )) : <p className='text-sm text-muted-foreground'>No updates for this incident yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Details</CardTitle>
              <CardDescription>{incident.id}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span><Badge>{incident.status}</Badge></span>
                </div>
                <Separator />
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity</span>
                    <span><Badge variant={severityVariant[incident.severity]}>{incident.severity}</Badge></span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Reporter</span>
                    <span>{incident.reporter.name}</span>
                </div>
                 <Separator />
                <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Assigned To</span>
                    <span>{incident.assignedTo?.name || 'Unassigned'}</span>
                </div>
                <Separator />
                 <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">Reported At</span>
                    <span>{new Date(incident.reportedAt).toLocaleString()}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
