'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Incident } from '@/lib/definitions';

interface IncidentsChartProps {
  incidents: Incident[];
}

export default function IncidentsChart({ incidents }: IncidentsChartProps) {
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  const data = severities.map((severity) => ({
    name: severity,
    total: incidents.filter((incident) => incident.severity === severity)
      .length,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Incidents by Severity</CardTitle>
        <CardDescription>
          A summary of open incidents categorized by their severity level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
