'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ThreatLog } from '@/lib/definitions'; 
import { useMemo } from 'react';

interface ThreatLogPriorityChartProps {
  threatLogs: ThreatLog[];
}

const COLORS = {
  'Baja': 'hsl(var(--chart-2))',
  'Media': 'hsl(var(--chart-4))',
  'Alta': 'hsl(var(--chart-5))',
  'Crítica': 'hsl(var(--destructive))',
};

const priorities: Array<ThreatLog['prioridad']> = ['Baja', 'Media', 'Alta', 'Crítica'];

export default function ThreatLogPriorityChart({ threatLogs }: ThreatLogPriorityChartProps) {
  const chartData = useMemo(() => {
    return priorities.map((priority) => ({
      name: priority,
      value: threatLogs.filter((log) => log.prioridad === priority).length,
      fill: COLORS[priority],
    })).filter(item => item.value > 0);

  }, [threatLogs]);

  const totalThreatLogs = useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Threat Logs by Priority</CardTitle>
        <CardDescription>
          Distribution of all logged threats by priority level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {totalThreatLogs > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                 <Tooltip
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                fill="hsl(var(--primary))"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                    iconSize={10}
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    formatter={(value, entry) => {
                        const { color } = entry;
                        return <span style={{ color }}>{value}</span>;
                    }}
                />
            </PieChart>
          </ResponsiveContainer>
        ) : (
            <div className="flex h-[300px] w-full items-center justify-center">
                <p className="text-muted-foreground">No threat log data available.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
