
'use client';

import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyThreatLog, ThreatCategories } from '@/lib/definitions';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ThreatsByCategoryPieChartProps {
  logData: MonthlyThreatLog;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ThreatsByCategoryPieChart({ logData }: ThreatsByCategoryPieChartProps) {
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

    return ThreatCategories.map((cat, index) => ({
        name: cat.label,
        value: totals[cat.key],
        fill: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);

  }, [logData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Threats by Category</CardTitle>
        <CardDescription>
          Distribution for the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
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
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              fill="hsl(var(--primary))"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
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
      </CardContent>
    </Card>
  );
}
