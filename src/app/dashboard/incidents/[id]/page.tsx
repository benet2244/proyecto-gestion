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
import { ArrowLeft, Edit, Trash2, FileUp, Paperclip } from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  const intelStatusVariant: { [key: string]: 'success' | 'destructive' | 'warning' } = {
    Green: 'success',
    Red: 'destructive',
    Yellow: 'warning',
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
          {/* General Info & Activity Log */}
          <div className="grid gap-6 md:grid-cols-2">
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
                        {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          {/* Workstream Tracker */}
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Workstream Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incident.workstreamTracker.map(task => (
                    <TableRow key={task.id}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell><Badge variant={task.priority === 'Alta' ? 'destructive' : 'default'}>{task.priority}</Badge></TableCell>
                      <TableCell><Badge variant="secondary">{task.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                   {incident.workstreamTracker.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No tasks tracked yet.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* System & Host Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Affected Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hostname</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>OS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incident.systems.map(system => (
                    <TableRow key={system.id}>
                      <TableCell>{system.hostname}</TableCell>
                      <TableCell>{system.ipAddress}</TableCell>
                      <TableCell>{system.status}</TableCell>
                      <TableCell>{system.systemOperating}</TableCell>
                    </TableRow>
                  ))}
                  {incident.systems.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No systems added yet.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Host Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Path</TableHead>
                    <TableHead>MD5</TableHead>
                    <TableHead>ATT&amp;CK</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incident.hostIndicators.map(indicator => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-mono text-xs">{indicator.fullPath}</TableCell>
                      <TableCell className="font-mono text-xs">{indicator.md5}</TableCell>
                      <TableCell>{indicator.attackAlignment}</TableCell>
                    </TableRow>
                  ))}
                  {incident.hostIndicators.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No host indicators added.</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Network Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indicator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incident.networkIndicators.map(indicator => (
                    <TableRow key={indicator.id}>
                      <TableCell className="font-mono text-xs">{indicator.indicator}</TableCell>
                      <TableCell><Badge variant={indicator.status === 'Confirmado' ? 'destructive' : 'outline'}>{indicator.status}</Badge></TableCell>
                      <TableCell>{indicator.source}</TableCell>
                    </TableRow>
                  ))}
                  {incident.networkIndicators.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No network indicators added.</TableCell></TableRow>}
                </TableBody>
              </Table>
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
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Workstream Assignment</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Scoping</span><span>{incident.workstreamAssignment.scoping}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Triage</span><span>{incident.workstreamAssignment.triage}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Intelligence</span><span>{incident.workstreamAssignment.intelligence}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Impact</span><span>{incident.workstreamAssignment.impact}</span></div>
            </CardContent>
           </Card>
           <Card>
            <CardHeader>
                <CardTitle className="font-headline">Intelligence</CardTitle>
            </CardHeader>
             <CardContent className="grid gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Intel Status</span>
                    <span><Badge variant={intelStatusVariant[incident.intelligence.status] || 'default'}>{incident.intelligence.status}</Badge></span>
                </div>
                <Separator />
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">RFI Status</span>
                    <span><Badge variant="secondary">{incident.intelligence.rfi}</Badge></span>
                </div>
                <Separator />
                <div className="space-y-2">
                    <span className="text-muted-foreground text-sm">Response</span>
                    <p className="text-sm">{incident.intelligence.response || "No response provided."}</p>
                </div>
                 <Separator />
                 <div className="space-y-2">
                    <span className="text-muted-foreground text-sm">Source File</span>
                    {incident.intelligence.sourceFile ? (
                        <div className="flex items-center gap-2">
                            <Paperclip />
                            <span className="text-sm font-medium">{incident.intelligence.sourceFile}</span>
                        </div>
                    ) : (
                        <p className="text-sm">No file uploaded.</p>
                    )}
                 </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
