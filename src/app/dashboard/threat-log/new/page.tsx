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
import ThreatLogForm from '@/components/threat-log/threat-log-form'; // Corregido


export default function NewThreatLogPage() {
    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href="/dashboard/threat-log">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Registrar Nueva Amenaza
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Detalles de la Amenaza</CardTitle>
                    <CardDescription>
                        Completa el formulario para reportar una nueva detección de amenaza.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThreatLogForm />
                </CardContent>
            </Card>
        </div>
    )
}
