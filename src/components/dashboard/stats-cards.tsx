import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Incident, ThreatLog } from '@/lib/definitions';
import {
  Activity,
  Siren,
  ScanSearch,
  BarChart3,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface StatsCardsProps {
  incidents: Incident[];
  threatLogs: ThreatLog[];
  totalThreats: number;
}

export default function StatsCards({ incidents, threatLogs, totalThreats }: StatsCardsProps) {
  const openIncidents = incidents.filter(
    (i) => i.status !== 'Cerrado'
  ).length;

  const criticalThreats = threatLogs.filter(
    (log) => log.prioridad === 'Crítica' || log.prioridad === 'Alta'
  ).length;

  const stats = [
    {
      title: 'Open Incidents',
      value: openIncidents,
      icon: Activity,
    },
    {
      title: 'Total Threat Logs',
      value: threatLogs.length,
      icon: ScanSearch,
    },
    {
      title: 'High/Critical Threats',
      value: criticalThreats,
      icon: Siren,
    },
    {
      title: 'Threats (This Month)',
      value: formatNumber(totalThreats),
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
