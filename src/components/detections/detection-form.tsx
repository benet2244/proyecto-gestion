

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Detection } from "@/lib/definitions"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar } from "../ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { analyzeHash } from "@/ai/flows/analyze-hash-flow"


const FormSchema = z.object({
  tipo_incidente: z.string().min(1, "Tipo de incidente es requerido."),
  prioridad: z.enum(["Baja", "Media", "Alta", "Crítica"]),
  fecha_incidente: z.date({
    required_error: "La fecha del incidente es requerida.",
  }),
  responsable: z.string().min(1, "Responsable es requerido."),
  equipo_afectado: z.string().min(1, "Equipo afectado es requerido."),
  direccion_mac: z.string().optional(),
  dependencia: z.string().min(1, "Dependencia es requerida."),
  estado_equipo: z.enum(["Infectado", "Mitigado", "En Alerta"]),
  acciones_tomadas: z.string().min(1, "Acciones tomadas son requeridas."),
  hash: z.string().optional(),
  detalles: z.string().min(1, "Detalles son requeridos."),
  estado: z.enum(["Abierto", "Pendiente", "Cerrado"]),
  nivel_amenaza: z.enum(["No Detectado", "Bajo", "Medio", "Alto", "Crítico", "Desconocido"]).optional(),
})

interface DetectionFormProps {
    detection?: Detection,
    isEditMode?: boolean,
}

export default function DetectionForm({ detection, isEditMode = false }: DetectionFormProps) {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        tipo_incidente: detection?.tipo_incidente || "",
        prioridad: detection?.prioridad || "Media",
        fecha_incidente: detection?.fecha_incidente ? new Date(detection.fecha_incidente) : new Date(),
        responsable: detection?.responsable || "",
        equipo_afectado: detection?.equipo_afectado || "",
        direccion_mac: detection?.direccion_mac || "",
        dependencia: detection?.dependencia || "",
        estado_equipo: detection?.estado_equipo || "En Alerta",
        acciones_tomadas: detection?.acciones_tomadas || "",
        hash: detection?.hash || "",
        detalles: detection?.detalles || "",
        estado: detection?.estado || "Abierto",
        nivel_amenaza: detection?.nivel_amenaza || undefined,
    }
  })

  const handleAnalyzeHash = async () => {
    const hash = form.getValues("hash");
    if (!hash || !/^[a-fA-F0-9]{32,128}$/.test(hash)) {
        toast({
            title: "Hash Inválido",
            description: "Por favor ingrese un hash MD5, SHA1 o SHA256 válido.",
            variant: "destructive",
        })
        return;
    }
    
    setIsAnalyzing(true);
    try {
        const result = await analyzeHash({ hash });
        form.setValue('nivel_amenaza', result.threatLevel, { shouldValidate: true });
        
        if(result.virusName) {
            const currentDetails = form.getValues('detalles');
            form.setValue('detalles', `${currentDetails}\n\nAnálisis VirusTotal: ${result.virusName}`);
        }

        toast({
            title: "Análisis Completado",
            description: `Nivel de Amenaza: ${result.threatLevel} (${result.maliciousCount}/${result.totalScans} motores)`
        });

    } catch(error) {
        console.error(error);
        toast({
            title: "Error de Análisis",
            description: "No se pudo conectar con el servicio de análisis. Intente de nuevo.",
            variant: "destructive",
        })
    } finally {
        setIsAnalyzing(false);
    }
  }

 async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    const endpoint = isEditMode ? `/api/detections/${detection?.id}` : '/api/detections';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      toast({
        title: detection ? "Detección Actualizada" : "Detección Creada",
        description: `La detección ${result.id} ha sido guardada.`,
      });

      router.push('/dashboard/detections');
      router.refresh();

    } catch (error) {
      console.error("Failed to submit form:", error);
      toast({
        title: "Error al guardar",
        description: "Ocurrió un error al guardar la detección. Por favor, intente de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="tipo_incidente"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipo de Incidente</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Malware, Phishing" {...field} disabled={isEditMode || isSubmitting}/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="prioridad"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Prioridad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode || isSubmitting}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccione una prioridad" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="fecha_incidente"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Incidente</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            disabled={isEditMode || isSubmitting}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={isEditMode || isSubmitting}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
             )}
            />
             <FormField
                control={form.control}
                name="responsable"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Responsable</FormLabel>
                    <FormControl>
                        <Input placeholder="Nombre del analista" {...field} disabled={isEditMode || isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
                control={form.control}
                name="equipo_afectado"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Equipo Afectado</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., LAPTOP-MKT-05" {...field} disabled={isEditMode || isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="direccion_mac"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Dirección MAC</FormLabel>
                    <FormControl>
                        <Input placeholder="00:1B:44:11:3A:B7" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormField
                control={form.control}
                name="dependencia"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Dependencia</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Marketing, Finanzas" {...field} disabled={isEditMode || isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="estado_equipo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estado del Equipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Infectado">Infectado</SelectItem>
                            <SelectItem value="Mitigado">Mitigado</SelectItem>
                            <SelectItem value="En Alerta">En Alerta</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="acciones_tomadas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acciones Tomadas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describa las acciones de contención, erradicación y recuperación..."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
            <FormField
                control={form.control}
                name="hash"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hash (MD5, SHA1, SHA256)</FormLabel>
                    <div className="flex gap-2">
                        <FormControl>
                            <Input placeholder="Hash del archivo sospechoso..." {...field} disabled={isEditMode || isSubmitting}/>
                        </FormControl>
                        <Button type="button" onClick={handleAnalyzeHash} disabled={isAnalyzing || isEditMode || isSubmitting}>
                            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Analizar
                        </Button>
                    </div>
                     <FormDescription>
                        Ingrese el hash para analizarlo con VirusTotal y determinar el nivel de amenaza.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {form.watch("nivel_amenaza") && (
                <div className="text-sm">
                    Nivel de Amenaza Determinado: <span className="font-semibold">{form.getValues("nivel_amenaza")}</span>
                </div>
            )}
        </div>


        <FormField
          control={form.control}
          name="detalles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalles Adicionales</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cualquier otra información relevante..."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
        control={form.control}
        name="estado"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Estado</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                <FormControl>
                <SelectTrigger><SelectValue placeholder="Seleccione un estado" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Abierto">Abierto</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Cerrado">Cerrado</SelectItem>
                </SelectContent>
            </Select>
            <FormMessage />
            </FormItem>
        )}
        />
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {detection ? "Update Detection" : "Create Detection"}
            </Button>
        </div>
      </form>
    </Form>
  )
}
