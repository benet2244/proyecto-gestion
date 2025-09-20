import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import IncidentForm from '@/components/incidents/incident-form';
import { Incident } from '@/lib/definitions';

async function getIncident(id: string): Promise<Incident | undefined> {
    const { getIncidentById } = await import('@/lib/data');
    return getIncidentById(id);
}


export default async function EditIncidentPage({ params }: { params: { id: string } }) {
    const incident = await getIncident(params.id);

    if (!incident) {
        return <div>Incident not found</div>
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href={`/dashboard/incidents/${params.id}`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Edit Incident: {incident.id}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Update Incident Details</CardTitle>
                    <CardDescription>
                        Modify the details for the incident below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <IncidentForm incident={incident} />
                </CardContent>
            </Card>
        </div>
    )
}
