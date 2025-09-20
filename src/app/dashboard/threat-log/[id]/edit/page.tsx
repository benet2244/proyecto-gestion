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
import ThreatLogForm from '@/components/threat-log/threat-log-form';
import { getThreatLogById } from '@/lib/actions';


export default async function EditThreatLogPage({ params }: { params: { id: string } }) {
    const threatLog = await getThreatLogById(params.id);

    if (!threatLog) {
        return <div>Registro de amenaza no encontrado.</div>
    }

    return (
        <div className="space-y-6">
             <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                <Link href={`/dashboard/threat-log`}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Editar Registro de Amenaza: {threatLog.id}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Actualizar Detalles del Registro</CardTitle>
                    <CardDescription>
                        Modifica los campos del registro de amenaza a continuación.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Corregido: Se elimina la prop isEditMode */}
                    <ThreatLogForm threatLog={threatLog} />
                </CardContent>
            </Card>
        </div>
    )
}
