"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { Incident, IncidentStatusSchema } from "@/lib/definitions"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


// Main Form Schema
const FormSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  status: IncidentStatusSchema,
})

// Section Components
function WorkstreamAssignmentForm() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormItem>
                <FormLabel>Scoping</FormLabel>
                <FormControl><Input placeholder="Assignee..."/></FormControl>
            </FormItem>
            <FormItem>
                <FormLabel>Triage</FormLabel>
                <FormControl><Input placeholder="Assignee..."/></FormControl>
            </FormItem>
            <FormItem>
                <FormLabel>Intelligence</FormLabel>
                <FormControl><Input placeholder="Assignee..."/></FormControl>
            </FormItem>
            <FormItem>
                <FormLabel>Impact</FormLabel>
                <FormControl><Input placeholder="Assignee..."/></FormControl>
            </FormItem>
        </div>
    )
}

function WorkstreamTrackerForm() {
    // In a real app, this would use useFieldArray from react-hook-form
    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm"><PlusCircle className="mr-2"/>Add Task</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-end gap-2">
                    <FormItem className="flex-1">
                        <FormLabel>Task</FormLabel>
                        <FormControl><Input placeholder="Describe the task..."/></FormControl>
                    </FormItem>
                    <Button type="button" variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button>
                </div>
                 <div className="grid grid-cols-3 gap-4">
                    <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <FormControl><Input placeholder="Assignee..."/></FormControl>
                    </FormItem>
                    <FormItem>
                        <FormLabel>Priority</FormLabel>
                         <Select><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Baja">Baja</SelectItem><SelectItem value="Media">Media</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select>
                    </FormItem>
                     <FormItem>
                        <FormLabel>Status</FormLabel>
                         <Select><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Complete">Complete</SelectItem></SelectContent></Select>
                    </FormItem>
                </div>
            </div>
        </div>
    )
}

function SystemForm() {
     return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm"><PlusCircle className="mr-2"/>Add System</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                 <div className="flex items-end gap-2">
                    <FormItem className="flex-1">
                        <FormLabel>Hostname</FormLabel>
                        <FormControl><Input placeholder="e.g., WEB-SRV-01"/></FormControl>
                    </FormItem>
                    <Button type="button" variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl><Input placeholder="e.g., 192.168.1.10"/></FormControl>
                    </FormItem>
                    <FormItem>
                        <FormLabel>Operating System</FormLabel>
                        <FormControl><Input placeholder="e.g., Windows Server 2022"/></FormControl>
                    </FormItem>
                </div>
                <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl><Textarea placeholder="System notes..."/></FormControl>
                </FormItem>
            </div>
        </div>
    )
}

function HostIndicatorsForm() {
    return (
        <div>
             <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm"><PlusCircle className="mr-2"/>Add Indicator</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-end gap-2">
                    <FormItem className="flex-1">
                        <FormLabel>Full Path & Name</FormLabel>
                        <FormControl><Input placeholder="e.g., C:\temp\malicious.exe"/></FormControl>
                    </FormItem>
                    <Button type="button" variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <FormItem><FormLabel>MD5</FormLabel><FormControl><Input /></FormControl></FormItem>
                    <FormItem><FormLabel>SHA1</FormLabel><FormControl><Input /></FormControl></FormItem>
                    <FormItem><FormLabel>SHA256</FormLabel><FormControl><Input /></FormControl></FormItem>
                </div>
                 <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl><Textarea placeholder="Indicator notes..."/></FormControl>
                </FormItem>
            </div>
        </div>
    )
}

function NetworkIndicatorsForm() {
    return (
        <div>
             <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm"><PlusCircle className="mr-2"/>Add Indicator</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-end gap-2">
                    <FormItem className="flex-1">
                        <FormLabel>Indicator (URL, IP, Domain)</FormLabel>
                        <FormControl><Input placeholder="e.g., http://malicious.com/payload.zip"/></FormControl>
                    </FormItem>
                     <Button type="button" variant="ghost" size="icon"><Trash2 className="text-destructive"/></Button>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <FormItem>
                        <FormLabel>Status</FormLabel>
                         <Select><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Sospechoso">Sospechoso</SelectItem><SelectItem value="Confirmado">Confirmado</SelectItem></SelectContent></Select>
                    </FormItem>
                     <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl><Input placeholder="e.g., Firewall Logs"/></FormControl>
                    </FormItem>
                </div>
            </div>
        </div>
    )
}

function IntelligenceForm() {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
                <FormItem>
                    <FormLabel>Intel Status</FormLabel>
                    <Select><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Green">Green</SelectItem><SelectItem value="Yellow">Yellow</SelectItem><SelectItem value="Red">Red</SelectItem></SelectContent></Select>
                </FormItem>
                <FormItem>
                    <FormLabel>RFI Status</FormLabel>
                    <Select><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Unanswered">Unanswered</SelectItem><SelectItem value="Awaiting Response">Awaiting Response</SelectItem><SelectItem value="Answered">Answered</SelectItem></SelectContent></Select>
                </FormItem>
                 <FormItem>
                    <FormLabel>Source File</FormLabel>
                    <FormControl><Input type="file" /></FormControl>
                </FormItem>
            </div>
             <FormItem>
                <FormLabel>Response</FormLabel>
                <FormControl><Textarea placeholder="Provide intelligence response..." className="h-full resize-none"/></FormControl>
            </FormItem>
        </div>
    )
}


// Main Component
interface IncidentFormProps {
    incident?: Incident;
}

export default function IncidentForm({ incident }: IncidentFormProps) {
  const isEditMode = !!incident;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: incident?.title || "",
        description: incident?.description || "",
        severity: incident?.severity || "Medium",
        status: incident?.status || "Identificación",
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: incident ? "Incident Updated" : "Incident Created",
      description: "The incident details have been saved. (This is a mock action)",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Details */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Phishing Attack on Finance Department" {...field} disabled={isEditMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the incident..."
                  className="resize-none"
                  {...field}
                  disabled={isEditMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a severity level" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an incident status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {IncidentStatusSchema.options.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        {/* Accordion for other sections */}
        <Accordion type="multiple" className="w-full space-y-4">
            <AccordionItem value="workstream-assignment" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Workstream Assignment</AccordionTrigger>
                <AccordionContent><WorkstreamAssignmentForm /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="workstream-tracker" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Workstream Tracker</AccordionTrigger>
                <AccordionContent><WorkstreamTrackerForm /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="systems" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Systems</AccordionTrigger>
                <AccordionContent><SystemForm /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="host-indicators" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Host Indicators</AccordionTrigger>
                <AccordionContent><HostIndicatorsForm /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="network-indicators" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Network Indicators</AccordionTrigger>
                <AccordionContent><NetworkIndicatorsForm /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="intelligence" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Intelligence</AccordionTrigger>
                <AccordionContent><IntelligenceForm /></AccordionContent>
            </AccordionItem>

        </Accordion>

        <div className="flex justify-end">
            <Button type="submit">{incident ? "Update Incident" : "Create Incident"}</Button>
        </div>
      </form>
    </Form>
  )
}
