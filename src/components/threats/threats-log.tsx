'use client';

import { useState, useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MonthlyThreatLog, ThreatLogEntry, ThreatCategory, ThreatCategories } from '@/lib/definitions';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ThreatsLogProps {
  initialLogData?: MonthlyThreatLog;
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

export default function ThreatsLog({ initialLogData }: ThreatsLogProps) {
  const [currentDate, setCurrentDate] = useState(new Date(initialLogData?.year || new Date().getFullYear(), initialLogData?.month -1 || new Date().getMonth()));
  const { toast } = useToast();

  const [logEntries, setLogEntries] = useState<ThreatLogEntry[]>(() => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
    const existingEntries = initialLogData?.entries || [];
    
    return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const existing = existingEntries.find(e => e.day === day);
        return existing || {
            day,
            malware: 0,
            phishing: 0,
            comando_control: 0,
            criptomineria: 0,
            denegacion_servicios: 0,
            intentos_conexion_bloqueados: 0,
            total: 0
        };
    });
  });

  const handleInputChange = (day: number, category: keyof Omit<ThreatLogEntry, 'day' | 'total'>, value: string) => {
    const numericValue = parseInt(value, 10) || 0;
    
    setLogEntries(prev => {
        const newEntries = [...prev];
        const entryIndex = newEntries.findIndex(e => e.day === day);
        if (entryIndex === -1) return prev;

        const updatedEntry = { ...newEntries[entryIndex], [category]: numericValue };

        const newTotal = Object.entries(updatedEntry)
            .filter(([key]) => key !== 'day' && key !== 'total')
            .reduce((sum, [, val]) => sum + (val as number), 0);
        
        updatedEntry.total = newTotal;
        newEntries[entryIndex] = updatedEntry;

        return newEntries;
    });
  };

  const totals = useMemo(() => {
    const initialTotals = ThreatCategories.reduce((acc, cat) => {
        acc[cat.key] = 0;
        return acc;
    }, {} as Record<ThreatCategory, number>);

    return logEntries.reduce((acc, entry) => {
        ThreatCategories.forEach(cat => {
            acc[cat.key] += entry[cat.key];
        });
        acc.total += entry.total;
        return acc;
    }, { ...initialTotals, total: 0 });
  }, [logEntries]);

  const handleSave = () => {
    // In a real app, this would send the data to an API
    console.log("Saving data:", {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        entries: logEntries
    });
    toast({
        title: "Log Saved!",
        description: "Your changes to the threat log have been saved.",
    });
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        // TODO: In a real app, fetch data for the new month here.
        // For now, it will reset to an empty log.
        const days = getDaysInMonth(newDate.getFullYear(), newDate.getMonth() + 1);
        setLogEntries(Array.from({ length: days }, (_, i) => ({
            day: i + 1, malware: 0, phishing: 0, comando_control: 0, criptomineria: 0, denegacion_servicios: 0, intentos_conexion_bloqueados: 0, total: 0
        })));
        return newDate;
    });
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="font-headline">Threats Log</CardTitle>
                <CardDescription>
                    Daily log of detected and mitigated threats.
                </CardDescription>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium text-lg w-40 text-center">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Log
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                {ThreatCategories.map(cat => (
                    <TableHead key={cat.key} className="min-w-[180px]">{cat.label}</TableHead>
                ))}
                <TableHead className="min-w-[120px]">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logEntries.map((entry) => (
                <TableRow key={entry.day}>
                    <TableCell className="font-medium">{`${entry.day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}</TableCell>
                    {ThreatCategories.map(cat => (
                        <TableCell key={cat.key}>
                            <Input
                                type="number"
                                value={entry[cat.key]}
                                onChange={(e) => handleInputChange(entry.day, cat.key, e.target.value)}
                                className="w-full"
                            />
                        </TableCell>
                    ))}
                    <TableCell className="font-semibold">{entry.total}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell className="font-bold">TOTAL</TableCell>
                    {ThreatCategories.map(cat => (
                         <TableCell key={cat.key} className="font-bold">{totals[cat.key]}</TableCell>
                    ))}
                    <TableCell className="font-bold">{totals.total}</TableCell>
                </TableRow>
            </TableFooter>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
