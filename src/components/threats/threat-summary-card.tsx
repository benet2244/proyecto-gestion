
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyThreatLog } from '@/lib/definitions';
import { ShieldAlert, TrendingUp, Zap } from 'lucide-react';

interface ThreatSummaryCardProps {
  logData: MonthlyThreatLog;
}

export default function ThreatSummaryCard({ logData }: ThreatSummaryCardProps) {
  const summaryStats = useMemo(() => {
    const totalThreats = logData.entries.reduce((sum, entry) => sum + entry.total, 0);
    const totalDays = logData.entries.length;
    const averageDailyThreats = totalDays > 0 ? Math.round(totalThreats / totalDays) : 0;
    
    let peakDay = { day: 0, total: 0 };
    if (logData.entries.length > 0) {
        peakDay = logData.entries.reduce((max, entry) => entry.total > max.total ? entry : max, logData.entries[0]);
    }

    return {
      totalThreats,
      averageDailyThreats,
      peakDayTotal: peakDay.total,
      peakDayDate: `${logData.month}/${peakDay.day}`,
    };
  }, [logData]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
            <ShieldAlert className="h-10 w-10 text-destructive" />
            <p className="text-3xl font-bold">
                {summaryStats.totalThreats}
            </p>
            <p className="text-sm text-muted-foreground">Total Threats</p>
        </div>
        <div className="flex flex-col items-center gap-2">
            <TrendingUp className="h-10 w-10 text-primary" />
            <p className="text-3xl font-bold">
                {summaryStats.averageDailyThreats}
            </p>
            <p className="text-sm text-muted-foreground">Avg. Daily Threats</p>
        </div>
         <div className="flex flex-col items-center gap-2">
            <Zap className="h-10 w-10 text-yellow-500" />
            <p className="text-3xl font-bold">
                {summaryStats.peakDayTotal}
            </p>
            <p className="text-sm text-muted-foreground">Peak on {summaryStats.peakDayDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}
