
'use client';

import { useState, useMemo, useRef } from "react";
import { DateRange } from "react-day-picker";
import { FileDown, Printer } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ThreatsByCategoryPieChart from "@/components/threats/charts/threats-by-category-pie-chart";
import ThreatSummaryCard from "@/components/threats/threat-summary-card";
import ThreatsTrendChart from "@/components/threats/charts/threats-trend-chart";
import ThreatDetailsTable from "@/components/threats/threat-details-table";
import { sampleThreatLogs } from "@/lib/data/threats";
import { MonthlyThreatLog, ThreatCategories } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";


export default function ThreatReportsPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 8, 1), // Sep 1, 2025
        to: new Date(2025, 8, 13),   // Sep 13, 2025
    });
    const reportPreviewRef = useRef<HTMLDivElement>(null);
    
    // For now, we use the full month data regardless of the date picker.
    // In a real app, you would fetch data based on the selected date range.
    const fullMonthLogData = useMemo(() => {
        return sampleThreatLogs.find(log => log.year === 2025 && log.month === 9);
    }, []);


    const filteredLogData = useMemo((): MonthlyThreatLog | undefined => {
        if (!fullMonthLogData) return undefined;
        if (!date?.from) return fullMonthLogData;

        const fromDate = date.from;
        const toDate = date.to || fromDate; // If no 'to' date, use 'from'

        const filteredEntries = fullMonthLogData.entries.filter(entry => {
            const entryDate = new Date(fullMonthLogData.year, fullMonthLogData.month - 1, entry.day);
            return entryDate >= fromDate && entryDate <= toDate;
        });

        return {
            ...fullMonthLogData,
            entries: filteredEntries,
        };

    }, [date, fullMonthLogData]);

     const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        if (!filteredLogData) {
            toast({
                title: "No hay datos para exportar",
                variant: "destructive"
            });
            return;
        }

        const headers = ["Día", ...ThreatCategories.map(c => c.label), "Total"];
        const csvRows = [headers.join(',')];

        for (const entry of filteredLogData.entries) {
            const values = [
                `${entry.day}/${filteredLogData.month}/${filteredLogData.year}`,
                ...ThreatCategories.map(c => entry[c.key]),
                entry.total,
            ];
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            const fromDateStr = date?.from ? format(date.from, "yyyy-MM-dd") : 'start';
            const toDateStr = date?.to ? format(date.to, "yyyy-MM-dd") : 'end';
            link.setAttribute('download', `threat_report_${fromDateStr}_to_${toDateStr}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        toast({
            title: "Exportando a CSV",
            description: "La descarga de tu reporte ha comenzado.",
        });
    };


    if (!fullMonthLogData || !filteredLogData) {
        return <p>No threat data available for the selected period.</p>
    }

    return (
        <div className="space-y-6 print:space-y-0">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <h1 className="text-2xl font-headline">Threat Reports</h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="mr-2" />
                        Export PDF
                    </Button>
                     <Button onClick={handleExportCSV} variant="outline">
                        <FileDown className="mr-2" />
                        Export Excel (CSV)
                    </Button>
                </div>
            </div>

            <Card ref={reportPreviewRef} id="report-preview-card">
                <CardContent className="p-6">
                     <style type="text/css" media="print">
                        {`
                        @page { size: auto; margin: 0.5in; }
                        body { -webkit-print-color-adjust: exact; }
                        #report-preview-card { border: none; box-shadow: none; }
                        `}
                    </style>
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-center font-headline">
                            Threat Report Preview
                        </h2>
                        <p className="text-center text-muted-foreground">
                            {`Report for period: ${date?.from ? format(date.from, "dd/MM/yyyy") : 'N/A'} - ${date?.to ? format(date.to, "dd/MM/yyyy") : 'N/A'}`}
                        </p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                            <div className="lg:col-span-1">
                                <ThreatsByCategoryPieChart logData={filteredLogData} />
                            </div>
                            <div className="lg:col-span-2">
                                <ThreatSummaryCard logData={filteredLogData} />
                            </div>
                        </div>

                        <ThreatsTrendChart logData={filteredLogData} />
                        
                        <ThreatDetailsTable logData={filteredLogData} fullMonthLogData={fullMonthLogData}/>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
