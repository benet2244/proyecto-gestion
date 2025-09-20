
'use client';

import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MonthlyThreatLog, ThreatCategories, ThreatCategory } from '@/lib/definitions';
import { formatNumber } from '@/lib/utils';

interface ThreatDetailsTableProps {
  logData: MonthlyThreatLog;
  fullMonthLogData: MonthlyThreatLog;
}


export default function ThreatDetailsTable({ logData, fullMonthLogData }: ThreatDetailsTableProps) {
  
  const periodTotals = useMemo(() => {
    const totals = ThreatCategories.reduce((acc, cat) => {
        acc[cat.key] = 0;
        return acc;
    }, {} as Record<ThreatCategory, number>);

    logData.entries.forEach(entry => {
        ThreatCategories.forEach(cat => {
            totals[cat.key] += entry[cat.key];
        });
    });
    return totals;
  }, [logData]);

  const monthlyTotals = useMemo(() => {
    const totals = ThreatCategories.reduce((acc, cat) => {
        acc[cat.key] = 0;
        return acc;
    }, {} as Record<ThreatCategory, number>);

    fullMonthLogData.entries.forEach(entry => {
        ThreatCategories.forEach(cat => {
            totals[cat.key] += entry[cat.key];
        });
    });
    return totals;
  }, [fullMonthLogData]);

  const periodGrandTotal = Object.values(periodTotals).reduce((a, b) => a + b, 0);
  const monthlyGrandTotal = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Threat Details</CardTitle>
        <CardDescription>
            A breakdown of threat counts for the period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Threat Type</TableHead>
                        <TableHead className="text-right">Attacks (Period)</TableHead>
                        <TableHead className="text-right">Attacks (Monthly Total)</TableHead>
                    </TableRow>
                </TableHeader>
                 <TableBody>
                    {ThreatCategories.map(cat => (
                        <TableRow key={cat.key}>
                            <TableCell className="font-medium">{cat.label}</TableCell>
                            <TableCell className="text-right">{formatNumber(periodTotals[cat.key])}</TableCell>
                            <TableCell className="text-right">{formatNumber(monthlyTotals[cat.key])}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                 <TableFooter>
                    <TableRow>
                        <TableCell className="font-bold">TOTAL</TableCell>
                         <TableCell className="text-right font-bold">
                            {formatNumber(periodGrandTotal)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                            {formatNumber(monthlyGrandTotal)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
