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
