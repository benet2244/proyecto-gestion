import { Incident, NewsArticle, Detection } from '@/lib/definitions';
import Parser from 'rss-parser';

// --- IN-MEMORY DATABASE (REPLACE WITH A REAL DATABASE) ---

export let incidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Phishing Attack on Finance Department',
    description: 'A targeted phishing campaign was identified affecting multiple users in the finance department. Credentials may have been compromised.',
    status: 'Contención',
    severity: 'High',
    reportedAt: '2024-07-20T09:15:00Z',
    reporter: { name: 'Alice Johnson', email: 'alice.j@example.com' },
    assignedTo: { name: 'Bob Williams', email: 'bob.w@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-20T09:30:00Z', update: 'Incident confirmed. Affected accounts are being identified and reset.' },
      { timestamp: '2024-07-20T11:00:00Z', update: 'All affected accounts have had their passwords reset. Monitoring for suspicious activity.' },
    ],
    workstreamAssignment: {
      scoping: 'Charlie Brown',
      triage: 'Alice Johnson',
      intelligence: 'Frank Miller',
      impact: 'Bob Williams',
    },
    workstreamTracker: [
      {
        id: 'WT-001',
        date: '2024-07-20',
        priority: 'Alta',
        status: 'In Progress',
        workstream: 'Triage',
        task: 'Identify all affected user accounts',
        assignedTo: 'Alice Johnson',
        dateUpdate: '2024-07-20',
        dateComplete: '',
      },
    ],
    systems: [
      {
        id: 'SYS-001',
        status: 'Affected',
        earliestEvidence: '2024-07-20T09:00:00Z',
        latestEvidence: '2024-07-20T09:15:00Z',
        hostname: 'FINANCE-PC-01',
        ipAddress: '192.168.1.100',
        domain: 'corporate.example.com',
        systemRole: 'Workstation',
        systemOperating: 'Windows 11',
        details: 'User clicked on a phishing link.',
        notes: 'PC has been isolated from the network.',
      },
    ],
    hostIndicators: [
      {
        id: 'HI-001',
        fullPath: 'C:\\Users\\ajohnson\\Downloads\\invoice.exe',
        sha256: 'a9b8c7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0u9v8w7x6y5z4a3b2c1d0e9f8',
        sha1: 'f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0',
        md5: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
        earliestEvidence: '2024-07-20T09:14:00Z',
        latestEvidence: '2024-07-20T09:14:00Z',
        attackAlignment: 'T1204 - User Execution',
        notes: 'Malicious executable downloaded by user.',
      },
    ],
    networkIndicators: [
      {
        id: 'NI-001',
        assignment: 'Malicious Domain',
        status: 'Confirmado',
        indicator: 'http://malicious-login-portal.com/auth',
        detail: 'Phishing URL from email.',
        latestEvidence: '2024-07-20T09:12:00Z',
        source: 'Email header analysis',
        notes: 'Domain blocked at firewall.',
      },
    ],
    intelligence: {
      status: 'Red',
      rfi: 'Answered',
      response: 'The phishing campaign is linked to the FIN8 threat actor group.',
    },
    evidenceTracker: [
        {
            id: 'EV-001',
            evidenceType: 'Email',
            evidenceSource: 'Phishing Report',
            date: '2024-07-20',
            dateReceived: '2024-07-20',
            evidenceLocation: 'SecurityOnion Case #SO-123',
            notes: 'Original phishing email with headers.',
        }
    ],
    applications: [
        {
            id: 'APP-001',
            submittedBy: 'Alice Johnson',
            status: 'compromised-malware'
        }
    ],
    forensics: [
        {
            id: 'FOR-001',
            highFidelityForensicKeywords: 'FIN8, invoice.exe, PowerShell',
            note: 'Forensic analysis of FINANCE-PC-01 shows evidence of lateral movement attempts.'
        }
    ],
    authorization: {
        authorizerName: 'General Counsel',
        authorizerRank: 'Director',
        catalog: 'Legal Hold #LH-2024-08'
    }
  },
  {
    id: 'INC-002',
    title: 'Unusual Login Activity on Production Server',
    description: 'Multiple failed login attempts detected from an unrecognized IP address targeting the main production database server.',
    status: 'Cerrado',
    severity: 'Critical',
    reportedAt: '2024-07-19T22:45:00Z',
    reporter: { name: 'System Alert', email: 'alerts@monitoring.com' },
    assignedTo: { name: 'Charlie Brown', email: 'charlie.b@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-19T22:50:00Z', update: 'IP address has been blocked at the firewall level.' },
      { timestamp: '2024-07-20T01:00:00Z', update: 'Investigation complete. No breach detected. Closing incident.' },
    ],
    workstreamAssignment: {},
    workstreamTracker: [],
    systems: [],
    hostIndicators: [],
    networkIndicators: [],
    intelligence: { status: 'Green', rfi: 'Unanswered', response: '' },
    evidenceTracker: [],
    applications: [],
    forensics: [],
    authorization: { authorizerName: '', authorizerRank: '', catalog: '' },
  },
  {
    id: 'INC-003',
    title: 'Malware Detected on Marketing Laptop',
    description: 'Antivirus software flagged and quarantined a trojan on the laptop assigned to a member of the marketing team.',
    status: 'Identificación',
    severity: 'Medium',
    reportedAt: '2024-07-21T14:00:00Z',
    reporter: { name: 'Diana Prince', email: 'diana.p@example.com' },
    updates: [],
    workstreamAssignment: {},
    workstreamTracker: [],
    systems: [],
hostIndicators: [],
    networkIndicators: [],
    intelligence: { status: 'Yellow', rfi: 'Unanswered', response: '' },
    evidenceTracker: [],
    applications: [],
    forensics: [],
    authorization: { authorizerName: '', authorizerRank: '', catalog: '' },
  },
    {
    id: 'INC-004',
    title: 'DDoS Attack on Main Website',
    description: 'The main corporate website is experiencing a Distributed Denial of Service (DDoS) attack, causing intermittent outages.',
    status: 'Contención',
    severity: 'Critical',
    reportedAt: '2024-07-22T10:00:00Z',
    reporter: { name: 'System Alert', email: 'alerts@monitoring.com' },
    assignedTo: { name: 'Bob Williams', email: 'bob.w@ciberseg.com' },
    updates: [
      { timestamp: '2024-07-22T10:05:00Z', update: 'DDoS mitigation service has been activated.' },
    ],
    workstreamAssignment: {},
    workstreamTracker: [],
    systems: [],
    hostIndicators: [],
    networkIndicators: [],
    intelligence: { status: 'Red', rfi: 'Awaiting Response', response: '' },
    evidenceTracker: [],
    applications: [],
    forensics: [],
    authorization: { authorizerName: '', authorizerRank: '', catalog: '' },
  },
  {
    id: 'INC-005',
    title: 'Outdated SSL Certificate',
    description: 'The SSL certificate for a secondary domain expired, causing browser warnings for visitors.',
    status: 'Cerrado',
    severity: 'Low',
    reportedAt: '2024-07-18T16:00:00Z',
    reporter: { name: 'Frank Miller', email: 'frank.m@example.com' },
    assignedTo: { name: 'Charlie Brown', email: 'charlie.b@ciberseg.com' },
    updates: [
       { timestamp: '2024-07-18T16:30:00Z', update: 'New SSL certificate has been installed and verified.' },
    ],
    workstreamAssignment: {},
    workstreamTracker: [],
    systems: [],
    hostIndicators: [],
    networkIndicators: [],
    intelligence: { status: 'Green', rfi: 'Answered', response: 'N/A' },
    evidenceTracker: [],
    applications: [],
    forensics: [],
    authorization: { authorizerName: '', authorizerRank: '', catalog: '' },
  }
];

export let detections: Detection[] = [
    {
        id: 'DET-001',
        tipo_incidente: 'Malware',
        prioridad: 'Alta',
        fecha_incidente: '2024-07-23T10:00:00Z',
        responsable: 'Juan Perez',
        equipo_afectado: 'LAPTOP-MKT-05',
        direccion_mac: '00:1B:44:11:3A:B7',
        dependencia: 'Marketing',
        estado_equipo: 'Infectado',
        acciones_tomadas: 'Aislamiento de la red, análisis antivirus iniciado.',
        hash: 'e4d909c290d0fb1ca068ffaddf22cbd0',
        nivel_amenaza: 'Alto',
        detalles: 'Se detectó un hash malicioso correspondiente a un troyano conocido. El usuario reportó lentitud en el equipo.',
        estado: 'Abierto',
    },
    {
        id: 'DET-002',
        tipo_incidente: 'Intento de Phishing',
        prioridad: 'Media',
        fecha_incidente: '2024-07-22T15:30:00Z',
        responsable: 'Maria Garcia',
        equipo_afectado: 'PC-FIN-02',
        direccion_mac: 'A8:20:66:01:12:C1',
        dependencia: 'Finanzas',
        estado_equipo: 'Mitigado',
        acciones_tomadas: 'Se eliminó el correo y se bloqueó al remitente. Se recordó al usuario sobre políticas de seguridad.',
        hash: 'N/A',
        nivel_amenaza: 'Bajo',
        detalles: 'El usuario recibió un correo sospechoso con un enlace para "verificar su cuenta". No hizo clic en el enlace.',
        estado: 'Cerrado',
    }
];

// --- DATA ACCESS FUNCTIONS ---

// NOTE: In a real app, these would be async and would fetch from a database.
// For now, they read from the in-memory array.

export const getIncidents = () => incidents;
export const getIncidentById = (id: string) => incidents.find(i => i.id === id);
export const addIncident = (incident: Omit<Incident, 'id'>) => {
  const newId = `INC-${String(incidents.length + 1).padStart(3, '0')}`;
  const newIncident: Incident = { ...incident, id: newId, reportedAt: new Date().toISOString() };
  incidents.push(newIncident);
  return newIncident;
}
export const updateIncident = (id: string, updates: Partial<Incident>) => {
    const index = incidents.findIndex(i => i.id === id);
    if (index !== -1) {
        incidents[index] = { ...incidents[index], ...updates };
        return incidents[index];
    }
    return null;
}
export const deleteIncident = (id: string) => {
    const index = incidents.findIndex(i => i.id === id);
    if (index !== -1) {
        incidents.splice(index, 1);
        return true;
    }
    return false;
}


export const getDetections = () => detections;
export const getDetectionById = (id: string) => detections.find(d => d.id === id);
export const addDetection = (detection: Omit<Detection, 'id'>) => {
    const newId = `DET-${String(detections.length + 1).padStart(3, '0')}`;
    const newDetection: Detection = { ...detection, id: newId };
    detections.push(newDetection);
    return newDetection;
};
export const updateDetection = (id: string, updates: Partial<Detection>) => {
    const index = detections.findIndex(d => d.id === id);
    if (index !== -1) {
        detections[index] = { ...detections[index], ...updates };
        return detections[index];
    }
    return null;
};
export const deleteDetection = (id: string) => {
    const index = detections.findIndex(d => d.id === id);
    if (index !== -1) {
        detections.splice(index, 1);
        return true;
    }
    return false;
};


// --- NEWS SERVICE ---

const parser = new Parser();
const RSS_URLS = [
    'https://thehackernews.com/feeds/posts/default'
];

const extractImageUrl = (content: string): string => {
    const imgTagRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgTagRegex);
    if (match && match[1]) {
        return match[1];
    }
    return `https://picsum.photos/seed/${Math.random()}/600/400`;
};

const assignCategory = (title: string): NewsArticle['category'] => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('vulnerability') || lowerTitle.includes('cve-')) return 'vulnerabilities';
    if (lowerTitle.includes('patch') || lowerTitle.includes('update')) return 'patches';
    if (lowerTitle.includes('malware') || lowerTitle.includes('ransomware') || lowerTitle.includes('trojan')) return 'malware';
    if (lowerTitle.includes('attack') || lowerTitle.includes('threat') || lowerTitle.includes('hacker')) return 'threats';
    return 'general';
};

// Cache for news articles
let newsArticles: NewsArticle[] | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
    const now = Date.now();
    if (newsArticles && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
        return newsArticles;
    }

    try {
        const feed = await parser.parseURL(RSS_URLS[0]);
        newsArticles = feed.items.map((item, index) => ({
            id: item.guid || `NEWS-${index}`,
            title: item.title || 'No Title',
            source: 'The Hacker News',
            url: item.link || '#',
            publishedAt: item.pubDate || new Date().toISOString(),
            imageUrl: extractImageUrl(item['content:encoded'] || item.content || ''),
            imageHint: 'cyber security',
            category: assignCategory(item.title || ''),
            content: item.contentSnippet || item.content || 'No content available.',
        }));
        lastFetchTime = now;
        return newsArticles;
    } catch (error) {
        console.error("Failed to fetch news articles:", error);
        // Return stale cache if available, otherwise empty array
        return newsArticles || [];
    }
};
