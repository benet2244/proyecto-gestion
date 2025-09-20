import { z } from 'zod';

export const IncidentStatusSchema = z.enum([
  'Identificación',
  'Contención',
  'Mitigación',
  'Recuperación',
  'Post-incidente',
  'Cerrado',
]);
export type IncidentStatus = z.infer<typeof IncidentStatusSchema>;

export const ApplicationStatusSchema = z.enum([
    'compromised-malware', 
    'tools', 
    'config-changes', 
    'accessed-confirmed', 
    'unauthorized-access', 
    'potentially-accessed', 
    'suspected-unauthorized-access'
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;


export type Incident = {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  reportedAt: string;
  reporter: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  updates: {
    timestamp: string;
    update: string;
  }[];
  workstreamAssignment: {
    id: string;
    name: string;
    role: 'Scoping' | 'Triage' | 'Intelligence' | 'Impact';
  }[];
  workstreamTracker: {
    id: string;
    date: string;
    priority: 'Alta' | 'Media' | 'Baja';
    status: 'New' | 'In Progress' | 'Complete' | 'In Review' | 'Backlog';
    workstream: string;
    task: string;
    assignedTo: string;
    dateUpdate: string;
    dateComplete: string;
  }[];
  systems: {
    id: string;
    status: string;
    earliestEvidence: string;
    latestEvidence: string;
    hostname: string;
    ipAddress: string;
    domain: string;
    systemRole: string;
    systemOperating: string;
    details: string;
    notes: string;
  }[];
  hostIndicators: {
    id: string;
    fullPath: string;
    sha256: string;
    sha1: string;
    md5: string;
    earliestEvidence: string;
    latestEvidence: string;
    attackAlignment: string;
    notes: string;
  }[];
  networkIndicators: {
    id: string;
    assignment: string;
    status: 'Sospechoso' | 'Confirmado' | 'Under Investigation' | 'Unrelated';
    indicator: string;
    detail: string;
    latestEvidence: string;
    source: string;
    notes: string;
  }[];
  intelligence: {
    status: 'Red' | 'Yellow' | 'Green';
    rfi: 'Unanswered' | 'Awaiting Response' | 'Answered';
    response: string;
    sourceFile?: string; // Name of the uploaded file
  };
  evidenceTracker: {
    id: string;
    evidenceType: string;
    evidenceSource: string;
    date: string;
    dateReceived: string;
    evidenceLocation: string;
    notes: string;
  }[];
  applications: {
    id: string;
    submittedBy: string;
    status: ApplicationStatus;
  }[];
  forensics: {
    id: string;
    highFidelityForensicKeywords: string;
    note: string;
  }[];
  authorization: {
    authorizerName: string;
    authorizerRank: string;
    catalog: string;
  };
};

export type NewsCategory = 'vulnerabilities' | 'patches' | 'malware' | 'threats' | 'general';

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl: string;
  imageHint: string;
  category: NewsCategory;
  content: string;
};

export type Detection = {
  id: string;
  tipo_incidente: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  fecha_incidente: string;
  responsable: string;
  equipo_afectado: string;
  direccion_mac: string;
  dependencia: string;
  estado_equipo: 'Infectado' | 'Mitigado' | 'En Alerta';
  acciones_tomadas: string;
  hash: string;
  nivel_amenaza: 'No Detectado' | 'Bajo' | 'Medio' | 'Alto' | 'Crítico' | 'Desconocido';
  detalles: string;
  estado: 'Abierto' | 'Pendiente' | 'Cerrado';
};

export const ThreatCategories = [
    { key: 'malware', label: 'Malware' },
    { key: 'phishing', label: 'Phishing' },
    { key: 'comando_control', label: 'Comando y Control' },
    { key: 'criptomineria', label: 'Criptomineria' },
    { key: 'denegacion_servicios', label: 'Denegación de Servicios' },
    { key: 'intentos_conexion_bloqueados', label: 'Intentos de Conexión Bloqueados' },
] as const;

export type ThreatCategory = typeof ThreatCategories[number]['key'];

export type ThreatLogEntry = {
    day: number;
    malware: number;
    phishing: number;
    comando_control: number;
    criptomineria: number;
    denegacion_servicios: number;
    intentos_conexion_bloqueados: number;
    total: number;
};

export type MonthlyThreatLog = {
    year: number;
    month: number; // 1-12
    entries: ThreatLogEntry[];
};


// Schemas for Genkit Flows

export const AnalyzeHashInputSchema = z.object({
  hash: z.string().describe('The file hash (MD5, SHA1, or SHA256) to analyze.'),
});
export type AnalyzeHashInput = z.infer<typeof AnalyzeHashInputSchema>;

export const AnalyzeHashOutputSchema = z.object({
  threatLevel: z.enum(['Crítico', 'Alto', 'Medio', 'Bajo', 'No Detectado', 'Desconocido']),
  maliciousCount: z.number().describe('Number of engines that detected the hash as malicious.'),
  totalScans: z.number().describe('Total number of engines that scanned the hash.'),
  virusType: z.string().optional().describe('The general type of malware detected (e.g., Trojan, Ransomware).'),
  virusName: z.string().optional().describe('Specific names of the detected malware.'),
});
export type AnalyzeHashOutput = z.infer<typeof AnalyzeHashOutputSchema>;
