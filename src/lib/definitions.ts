
export type Incident = {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Resolved';
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
  estado_equipo: string;
  acciones_tomadas: string;
  hash: string;
  nivel_amenaza: 'No Detectado' | 'Bajo' | 'Medio' | 'Alto' | 'Crítico' | 'Desconocido';
  detalles: string;
  estado: 'Abierto' | 'Pendiente' | 'Cerrado';
};
