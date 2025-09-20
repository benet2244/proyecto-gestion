
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Detection } from '@/lib/definitions';
import { useMemo } from 'react';

interface DetectionsPriorityChartProps {
  detections: Detection[];
}

const COLORS = {
  'Baja': 'hsl(var(--chart-2))',
  'Media': 'hsl(var(--chart-4))',
  'Alta': 'hsl(var(--chart-5))',
  'Crítica': 'hsl(var(--destructive))',
};

const priorities: Array<Detection['prioridad']> = ['Baja', 'Media', 'Alta', 'Crítica'];


export default function DetectionsPriorityChart({ detections }: DetectionsPriorityChartProps) {
  const chartData = useMemo(() => {
    const data = priorities.map((priority) => ({
      name: priority,
      value: detections.filter((detection) => detection.prioridad === priority).length,
      fill: COLORS[priority],
    })).filter(item => item.value > 0);

    return data;
  }, [detections]);

  const totalDetections = useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Detections by Priority</CardTitle>
        <CardDescription>
          Distribution of all logged detections by priority level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {detections.length > 0 ? (
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
                <p className="text-muted-foreground">No detection data available.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
