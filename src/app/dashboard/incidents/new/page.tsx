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


export default function NewIncidentPage() {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/incidents" aria-label="Back to incidents">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Incidents</span>
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Log a New Incident
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Incident Details</CardTitle>
                    <CardDescription>
                        Fill out the form below to report a new cybersecurity incident.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <IncidentForm />
                </CardContent>
            </Card>
        </div>
    )
}
