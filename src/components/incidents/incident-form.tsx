"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray, Control } from "react-hook-form"
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
import { Incident, IncidentStatusSchema, ApplicationStatusSchema } from "@/lib/definitions"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Schemas for sub-sections
const WorkstreamAssignmentSchema = z.object({
  scoping: z.string().optional(),
  triage: z.string().optional(),
  intelligence: z.string().optional(),
  impact: z.string().optional(),
});


const WorkstreamTrackerSchema = z.object({
  id: z.string().optional(),
  task: z.string().min(1, "Task is required"),
  assignedTo: z.string().min(1, "Assignee is required"),
  priority: z.enum(["Alta", "Media", "Baja"]),
  status: z.enum(["New", "In Progress", "Complete"]),
});

const SystemSchema = z.object({
  id: z.string().optional(),
  hostname: z.string().min(1, "Hostname is required"),
  ipAddress: z.string().optional(),
  systemOperating: z.string().optional(),
  notes: z.string().optional(),
});

const HostIndicatorSchema = z.object({
  id: z.string().optional(),
  fullPath: z.string().min(1, "Path is required"),
  md5: z.string().optional(),
  sha1: z.string().optional(),
  sha256: z.string().optional(),
  notes: z.string().optional(),
});

const NetworkIndicatorSchema = z.object({
    id: z.string().optional(),
    indicator: z.string().min(1, "Indicator is required"),
    status: z.enum(["Sospechoso", "Confirmado"]),
    source: z.string().optional(),
});

const EvidenceTrackerSchema = z.object({
    id: z.string().optional(),
    evidenceType: z.string().min(1, "Type is required"),
    evidenceSource: z.string().optional(),
    dateReceived: z.string().optional(),
    evidenceLocation: z.string().optional(),
});

const ApplicationSchema = z.object({
    id: z.string().optional(),
    submittedBy: z.string().min(1, "Submitter is required"),
    status: ApplicationStatusSchema,
});

const ForensicSchema = z.object({
    id: z.string().optional(),
    highFidelityForensicKeywords: z.string().optional(),
    note: z.string().min(1, "Note is required"),
});


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
  workstreamAssignment: WorkstreamAssignmentSchema.optional(),
  workstreamTracker: z.array(WorkstreamTrackerSchema).optional(),
  systems: z.array(SystemSchema).optional(),
  hostIndicators: z.array(HostIndicatorSchema).optional(),
  networkIndicators: z.array(NetworkIndicatorSchema).optional(),
  intelligence: z.object({
    status: z.enum(["Green", "Yellow", "Red"]),
    rfi: z.enum(["Unanswered", "Awaiting Response", "Answered"]),
    sourceFile: z.any().optional(),
    response: z.string().optional(),
  }).optional(),
  evidenceTracker: z.array(EvidenceTrackerSchema).optional(),
  applications: z.array(ApplicationSchema).optional(),
  forensics: z.array(ForensicSchema).optional(),
  authorization: z.object({
    authorizerName: z.string().optional(),
    authorizerRank: z.string().optional(),
    catalog: z.string().optional(),
  }).optional(),
})

type FormValues = z.infer<typeof FormSchema>;

interface SectionProps<T> {
  control: Control<FormValues>;
  incident?: Incident;
}

// Section Components
function WorkstreamAssignmentForm({ control }: SectionProps<any>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4 border rounded-lg">
      <FormField
        control={control}
        name="workstreamAssignment.scoping"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Scoping</FormLabel>
            <FormControl>
              <Input placeholder="Assignee Name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="workstreamAssignment.triage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Triage</FormLabel>
            <FormControl>
              <Input placeholder="Assignee Name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="workstreamAssignment.intelligence"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intelligence</FormLabel>
            <FormControl>
              <Input placeholder="Assignee Name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="workstreamAssignment.impact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Impact</FormLabel>
            <FormControl>
              <Input placeholder="Assignee Name..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


function WorkstreamTrackerForm({ control }: SectionProps<any>) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workstreamTracker",
    });
    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ task: "", assignedTo: "", priority: "Media", status: "New" })}><PlusCircle className="mr-2"/>Add Task</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                 {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField
                            control={control}
                            name={`workstreamTracker.${index}.task`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Task</FormLabel>
                                    <FormControl><Input placeholder="Describe the task..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={control}
                                name={`workstreamTracker.${index}.assignedTo`}
                                render={({ field }) => (
                                    <FormItem><FormLabel>Assigned To</FormLabel><FormControl><Input placeholder="Assignee..." {...field}/></FormControl><FormMessage /></FormItem>
                                )}
                            />
                             <FormField
                                control={control}
                                name={`workstreamTracker.${index}.priority`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Baja">Baja</SelectItem><SelectItem value="Media">Media</SelectItem><SelectItem value="Alta">Alta</SelectItem></SelectContent></Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`workstreamTracker.${index}.status`}
                                render={({ field }) => (
                                     <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="New">New</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Complete">Complete</SelectItem></SelectContent></Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No tasks added yet.</p>}
            </div>
        </div>
    )
}

function SystemForm({ control }: SectionProps<any>) {
    const { fields, append, remove } = useFieldArray({ control, name: "systems" });
     return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ hostname: "", ipAddress: "", systemOperating: "", notes: "" })}><PlusCircle className="mr-2"/>Add System</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                 {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField
                            control={control}
                            name={`systems.${index}.hostname`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Hostname</FormLabel>
                                    <FormControl><Input placeholder="e.g., WEB-SRV-01" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={control} name={`systems.${index}.ipAddress`} render={({ field }) => (<FormItem><FormLabel>IP Address</FormLabel><FormControl><Input placeholder="e.g., 192.168.1.10" {...field} /></FormControl></FormItem>)} />
                             <FormField control={control} name={`systems.${index}.systemOperating`} render={({ field }) => (<FormItem><FormLabel>Operating System</FormLabel><FormControl><Input placeholder="e.g., Windows Server 2022" {...field} /></FormControl></FormItem>)} />
                        </div>
                         <FormField control={control} name={`systems.${index}.notes`} render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="System notes..." {...field}/></FormControl></FormItem>)} />
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No systems added yet.</p>}
            </div>
        </div>
    )
}

function HostIndicatorsForm({ control }: SectionProps<any>) {
     const { fields, append, remove } = useFieldArray({ control, name: "hostIndicators" });
    return (
        <div>
             <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ fullPath: "", md5: "", sha1: "", sha256: "", notes: ""})}><PlusCircle className="mr-2"/>Add Indicator</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField control={control} name={`hostIndicators.${index}.fullPath`} render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Full Path & Name</FormLabel>
                                <FormControl><Input placeholder="e.g., C:\temp\malicious.exe" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-3 gap-4">
                             <FormField control={control} name={`hostIndicators.${index}.md5`} render={({ field }) => (<FormItem><FormLabel>MD5</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                             <FormField control={control} name={`hostIndicators.${index}.sha1`} render={({ field }) => (<FormItem><FormLabel>SHA1</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                             <FormField control={control} name={`hostIndicators.${index}.sha256`} render={({ field }) => (<FormItem><FormLabel>SHA256</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                        </div>
                        <FormField control={control} name={`hostIndicators.${index}.notes`} render={({ field }) => (<FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea placeholder="Indicator notes..." {...field} /></FormControl></FormItem>)} />
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No host indicators added yet.</p>}
            </div>
        </div>
    )
}

function NetworkIndicatorsForm({ control }: SectionProps<any>) {
    const { fields, append, remove } = useFieldArray({ control, name: "networkIndicators" });
    return (
        <div>
             <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ indicator: "", status: "Sospechoso", source: ""})}><PlusCircle className="mr-2"/>Add Indicator</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                 {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField control={control} name={`networkIndicators.${index}.indicator`} render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Indicator (URL, IP, Domain)</FormLabel>
                                <FormControl><Input placeholder="e.g., http://malicious.com/payload.zip" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={control} name={`networkIndicators.${index}.status`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Sospechoso">Sospechoso</SelectItem><SelectItem value="Confirmado">Confirmado</SelectItem></SelectContent></Select>
                                </FormItem>
                            )}/>
                            <FormField control={control} name={`networkIndicators.${index}.source`} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Source</FormLabel>
                                    <FormControl><Input placeholder="e.g., Firewall Logs" {...field} /></FormControl>
                                </FormItem>
                            )}/>
                        </div>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No network indicators added yet.</p>}
            </div>
        </div>
    )
}

function IntelligenceForm({ control }: SectionProps<any>) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
                 <FormField control={control} name="intelligence.status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Intel Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Green">Green</SelectItem><SelectItem value="Yellow">Yellow</SelectItem><SelectItem value="Red">Red</SelectItem></SelectContent></Select>
                    </FormItem>
                 )}/>
                 <FormField control={control} name="intelligence.rfi" render={({ field }) => (
                    <FormItem>
                        <FormLabel>RFI Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Unanswered">Unanswered</SelectItem><SelectItem value="Awaiting Response">Awaiting Response</SelectItem><SelectItem value="Answered">Answered</SelectItem></SelectContent></Select>
                    </FormItem>
                )}/>
                 <FormField control={control} name="intelligence.sourceFile" render={({ field }) => (
                     <FormItem>
                        <FormLabel>Source File</FormLabel>
                        <FormControl><Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
                    </FormItem>
                 )} />
            </div>
             <FormField control={control} name="intelligence.response" render={({ field }) => (
                 <FormItem>
                    <FormLabel>Response</FormLabel>
                    <FormControl><Textarea placeholder="Provide intelligence response..." className="h-full resize-none" {...field}/></FormControl>
                </FormItem>
             )}/>
        </div>
    )
}

function EvidenceTrackerForm({ control }: SectionProps<any>) {
    const { fields, append, remove } = useFieldArray({ control, name: "evidenceTracker" });
    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ evidenceType: "", evidenceSource: "", dateReceived: new Date().toISOString().split('T')[0], evidenceLocation: ""})}><PlusCircle className="mr-2"/>Add Evidence</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField control={control} name={`evidenceTracker.${index}.evidenceType`} render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Evidence Type</FormLabel>
                                <FormControl><Input placeholder="e.g., Log File, Screenshot" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             <FormField control={control} name={`evidenceTracker.${index}.evidenceSource`} render={({ field }) => (<FormItem><FormLabel>Source</FormLabel><FormControl><Input placeholder="e.g., SIEM" {...field}/></FormControl></FormItem>)} />
                             <FormField control={control} name={`evidenceTracker.${index}.dateReceived`} render={({ field }) => (<FormItem><FormLabel>Date Received</FormLabel><FormControl><Input type="date" {...field}/></FormControl></FormItem>)} />
                             <FormField control={control} name={`evidenceTracker.${index}.evidenceLocation`} render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Case Folder" {...field}/></FormControl></FormItem>)} />
                        </div>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No evidence added yet.</p>}
            </div>
        </div>
    )
}

function ApplicationForm({ control }: SectionProps<any>) {
     const { fields, append, remove } = useFieldArray({ control, name: "applications" });
    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ submittedBy: "", status: "compromised-malware"})}><PlusCircle className="mr-2"/>Add Application</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                         <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField control={control} name={`applications.${index}.submittedBy`} render={({ field }) => (
                             <FormItem className="flex-1">
                                <FormLabel>Submitted By</FormLabel>
                                <FormControl><Input placeholder="Analyst Name" {...field}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={control} name={`applications.${index}.status`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {ApplicationStatusSchema.options.map(status => (
                                            <SelectItem key={status} value={status}>{status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}/>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No applications added yet.</p>}
            </div>
        </div>
    )
}

function ForensicForm({ control }: SectionProps<any>) {
     const { fields, append, remove } = useFieldArray({ control, name: "forensics" });
    return (
        <div>
             <div className="flex justify-end mb-2">
                <Button type="button" variant="outline" size="sm" onClick={() => append({ highFidelityForensicKeywords: "", note: ""})}><PlusCircle className="mr-2"/>Add Entry</Button>
            </div>
            <div className="border rounded-lg p-4 space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}><Trash2 className="text-destructive"/></Button>
                        <FormField control={control} name={`forensics.${index}.highFidelityForensicKeywords`} render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>High Fidelity Forensic Keywords</FormLabel>
                                <FormControl><Input placeholder="Keywords..." {...field}/></FormControl>
                            </FormItem>
                        )}/>
                        <FormField control={control} name={`forensics.${index}.note`} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl><Textarea placeholder="Forensic notes..." {...field}/></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                ))}
                 {fields.length === 0 && <p className="text-sm text-muted-foreground text-center">No forensic entries added yet.</p>}
            </div>
        </div>
    )
}

function AuthorizationForm({ control }: SectionProps<any>) {
    return (
        <div className="grid grid-cols-3 gap-4">
            <FormField control={control} name="authorization.authorizerName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Authorizer Name</FormLabel>
                    <FormControl><Input placeholder="e.g., John Doe" {...field}/></FormControl>
                </FormItem>
            )}/>
             <FormField control={control} name="authorization.authorizerRank" render={({ field }) => (
                 <FormItem>
                    <FormLabel>Authorizer Rank/Title</FormLabel>
                    <FormControl><Input placeholder="e.g., CISO" {...field}/></FormControl>
                </FormItem>
             )}/>
             <FormField control={control} name="authorization.catalog" render={({ field }) => (
                 <FormItem>
                    <FormLabel>Catalog/Reference</FormLabel>
                    <FormControl><Input placeholder="e.g., Legal Hold #123" {...field}/></FormControl>
                </FormItem>
             )}/>
        </div>
    )
}


// Main Component
interface IncidentFormProps {
    incident?: Incident;
}

export default function IncidentForm({ incident }: IncidentFormProps) {
  const isEditMode = !!incident;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        title: incident?.title || "",
        description: incident?.description || "",
        severity: incident?.severity || "Medium",
        status: incident?.status || "Identificación",
        workstreamAssignment: incident?.workstreamAssignment || { scoping: "", triage: "", intelligence: "", impact: "" },
        workstreamTracker: incident?.workstreamTracker.map(t => ({...t, priority: t.priority as "Alta" | "Media" | "Baja", status: t.status as "New" | "In Progress" | "Complete"})) || [],
        systems: incident?.systems || [],
        hostIndicators: incident?.hostIndicators.map(h => ({...h, notes: h.notes || ''})) || [],
        networkIndicators: incident?.networkIndicators.map(n => ({...n, status: n.status as "Sospechoso" | "Confirmado"})) || [],
        intelligence: incident?.intelligence ? { ...incident.intelligence, status: incident.intelligence.status as "Green" | "Yellow" | "Red", rfi: incident.intelligence.rfi as "Unanswered" | "Awaiting Response" | "Answered" } : { status: "Green", rfi: "Unanswered", response: "" },
        evidenceTracker: incident?.evidenceTracker || [],
        applications: incident?.applications || [],
        forensics: incident?.forensics || [],
        authorization: incident?.authorization || { authorizerName: "", authorizerRank: "", catalog: "" },
    }
  })

  function onSubmit(data: FormValues) {
    toast({
      title: incident ? "Incident Updated" : "Incident Created",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
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
        <Accordion type="multiple" className="w-full space-y-4" defaultValue={["workstream-assignment"]}>
            <AccordionItem value="workstream-assignment" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Workstream Assignment</AccordionTrigger>
                <AccordionContent><WorkstreamAssignmentForm control={form.control} incident={incident} /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="workstream-tracker" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Workstream Tracker</AccordionTrigger>
                <AccordionContent><WorkstreamTrackerForm control={form.control} incident={incident} /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="systems" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Systems</AccordionTrigger>
                <AccordionContent><SystemForm control={form.control} /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="host-indicators" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Host Indicators</AccordionTrigger>
                <AccordionContent><HostIndicatorsForm control={form.control} /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="network-indicators" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Network Indicators</AccordionTrigger>
                <AccordionContent><NetworkIndicatorsForm control={form.control} /></AccordionContent>
            </AccordionItem>

             <AccordionItem value="intelligence" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Intelligence</AccordionTrigger>
                <AccordionContent><IntelligenceForm control={form.control} /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="evidence-tracker" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Evidence Tracker</AccordionTrigger>
                <AccordionContent><EvidenceTrackerForm control={form.control} /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="application" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Application</AccordionTrigger>
                <AccordionContent><ApplicationForm control={form.control} /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="forensic" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Forensic</AccordionTrigger>
                <AccordionContent><ForensicForm control={form.control} /></AccordionContent>
            </AccordionItem>

            <AccordionItem value="authorization" className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="font-headline text-lg">Authorization</AccordionTrigger>
                <AccordionContent><AuthorizationForm control={form.control} /></AccordionContent>
            </AccordionItem>

        </Accordion>

        <div className="flex justify-end">
            <Button type="submit">{incident ? "Update Incident" : "Create Incident"}</Button>
        </div>
      </form>
    </Form>
  )
}
