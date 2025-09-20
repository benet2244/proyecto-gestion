'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ThreatLog } from '@/lib/definitions';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeHash, createThreatLog, updateThreatLog } from '@/lib/actions';

const FormSchema = z.object({
    tipo_incidente: z.string().min(1, "Tipo de incidente es requerido"),
    prioridad: z.enum(['Baja', 'Media', 'Alta', 'Crítica'], { required_error: "Prioridad es requerida" }),
    fecha_incidente: z.date({ required_error: "Fecha del incidente es requerida" }),
    responsable: z.string().min(1, "Responsable es requerido"),
    equipo_afectado: z.string().min(1, "Equipo afectado es requerido"),
    direccion_mac: z.string().optional(),
    dependencia: z.string().min(1, "Dependencia es requerida"),
    estado_equipo: z.enum(['Infectado', 'Mitigado', 'En Alerta'], { required_error: "Estado del equipo es requerido" }),
    acciones_tomadas: z.string().min(1, "Acciones tomadas son requeridas"),
    hash: z.string().optional(),
    nivel_amenaza: z.enum(['No Detectado', 'Bajo', 'Medio', 'Alto', 'Crítico', 'Desconocido'], { required_error: "Nivel de amenaza es requerido" }),
    detalles: z.string().optional(),
    estado: z.enum(['Abierto', 'Pendiente', 'Cerrado'], { required_error: "Estado es requerido" }),
});

interface ThreatLogFormProps {
    threatLog?: ThreatLog;
}

export default function ThreatLogForm({ threatLog }: ThreatLogFormProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!threatLog;
    const { toast } = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: isEditMode ? {
            ...threatLog,
            fecha_incidente: new Date(threatLog.fecha_incidente),
        } : {
            prioridad: 'Media',
            estado_equipo: 'En Alerta',
            nivel_amenaza: 'Desconocido',
            estado: 'Abierto',
        },
    });

    const handleAnalyzeHash = async () => {
        const hash = form.getValues("hash");
        if (!hash) {
            toast({ title: "No Hash Provided", description: "Please enter a hash to analyze.", variant: "destructive" });
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await analyzeHash({ hash });
            form.setValue('nivel_amenaza', result.threatLevel);
            form.setValue('detalles', `VirusTotal: ${result.maliciousCount}/${result.totalScans} engines detected this hash. Type: ${result.virusType || 'N/A'}. Name: ${result.virusName || 'N/A'}`);
            toast({ title: "Análisis Completado", description: "El nivel de amenaza y los detalles han sido actualizados." });
        } catch (error) {
            console.error("Failed to analyze hash:", error);
            toast({ title: "Error de Análisis", description: "No se pudo analizar el hash. Intente de nuevo.", variant: "destructive" });
        } finally {
            setIsAnalyzing(false);
        }
    };

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, format(value, 'yyyy-MM-dd HH:mm:ss'));
            } else if (value) {
                formData.append(key, value as string);
            }
        });

        try {
            if (isEditMode) {
                await updateThreatLog(threatLog.id, formData);
            } else {
                await createThreatLog(formData);
            }
            toast({
                title: isEditMode ? "Registro Actualizado" : "Registro Creado",
                description: `El registro de amenaza ha sido guardado correctamente.`,
            });
        } catch (error) {
            console.error("Failed to submit form:", error);
            toast({
                title: "Error al guardar",
                description: "Ocurrió un error al guardar el registro. Por favor, intente de nuevo.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <FormField control={form.control} name="tipo_incidente" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Incidente</FormLabel>
                                <FormControl><Input placeholder="Ej: Malware, Phishing" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="prioridad" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prioridad</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una prioridad" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Baja', 'Media', 'Alta', 'Crítica'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="fecha_incidente" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha del Incidente</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Seleccione una fecha</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="responsable" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Responsable</FormLabel>
                                <FormControl><Input placeholder="Nombre del analista" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>

                    <div className="space-y-4">
                        <FormField control={form.control} name="equipo_afectado" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Equipo Afectado</FormLabel>
                                <FormControl><Input placeholder="Nombre del equipo o ID" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="direccion_mac" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dirección MAC</FormLabel>
                                <FormControl><Input placeholder="00:1B:44:11:3A:B7" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dependencia" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dependencia</FormLabel>
                                <FormControl><Input placeholder="Ej: Finanzas, RRHH" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="estado_equipo" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado del Equipo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Infectado', 'Mitigado', 'En Alerta'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>

                    <div className="space-y-4">
                        <FormField control={form.control} name="hash" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hash (MD5, SHA1, SHA256)</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl><Input placeholder="Hash del archivo sospechoso" {...field} /></FormControl>
                                    <Button type="button" onClick={handleAnalyzeHash} disabled={isAnalyzing}>
                                        {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analizar"}
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="nivel_amenaza" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nivel de Amenaza</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un nivel de amenaza" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['No Detectado', 'Bajo', 'Medio', 'Alto', 'Crítico', 'Desconocido'].map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="estado" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado del Registro</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Abierto', 'Pendiente', 'Cerrado'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>

                <FormField control={form.control} name="acciones_tomadas" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Acciones Tomadas</FormLabel>
                        <FormControl><Textarea placeholder="Describa las acciones realizadas..." {...field} className="min-h-[100px]" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="detalles" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Detalles Adicionales</FormLabel>
                        <FormControl><Textarea placeholder="Resultados del análisis, IOCs..." {...field} className="min-h-[100px]" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : (isEditMode ? 'Actualizar Registro' : 'Crear Registro')}
                </Button>
            </form>
        </Form>
    );
}
