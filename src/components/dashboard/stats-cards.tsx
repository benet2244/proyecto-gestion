import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Incident } from '@/lib/definitions';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

interface StatsCardsProps {
  incidents: Incident[];
}

export default function StatsCards({ incidents }: StatsCardsProps) {
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(
    (i) => i.status === 'Open' || i.status === 'In Progress'
  ).length;
  const closedIncidents = incidents.filter(
    (i) => i.status === 'Closed' || i.status === 'Resolved'
  ).length;
  const criticalIncidents = incidents.filter(
    (i) => i.severity === 'Critical'
  ).length;

  const stats = [
    {
      title: 'Total Incidents',
      value: totalIncidents,
      icon: ShieldAlert,
    },
    {
      title: 'Open Incidents',
      value: openIncidents,
      icon: Activity,
    },
    {
      title: 'Closed Incidents',
      value: closedIncidents,
      icon: CheckCircle,
    },
    {
      title: 'Critical Incidents',
      value: criticalIncidents,
      icon: AlertTriangle,
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
