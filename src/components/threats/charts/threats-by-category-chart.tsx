'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyThreatLog, ThreatCategories } from '@/lib/definitions';
import { useMemo } from 'react';

interface ThreatsByCategoryChartProps {
  logData: MonthlyThreatLog;
}

export default function ThreatsByCategoryChart({ logData }: ThreatsByCategoryChartProps) {
  const chartData = useMemo(() => {
    const totals = ThreatCategories.reduce((acc, cat) => {
        acc[cat.key] = 0;
        return acc;
    }, {} as Record<string, number>);

    logData.entries.forEach(entry => {
        ThreatCategories.forEach(cat => {
            totals[cat.key] += entry[cat.key];
        });
    });

    return ThreatCategories.map(cat => ({
        name: cat.label,
        total: totals[cat.key],
    }));

  }, [logData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Threats by Category</CardTitle>
        <CardDescription>
          Total threats detected in the month, broken down by category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                width={150}
                interval={0}
             />
             <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
