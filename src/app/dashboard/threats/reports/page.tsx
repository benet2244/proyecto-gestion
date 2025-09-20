
'use client';

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ThreatsByCategoryPieChart from "@/components/threats/charts/threats-by-category-pie-chart";
import ThreatSummaryCard from "@/components/threats/threat-summary-card";
import ThreatsTrendChart from "@/components/threats/charts/threats-trend-chart";
import ThreatDetailsTable from "@/components/threats/threat-details-table";
import { sampleThreatLogs } from "@/lib/data/threats";
import { MonthlyThreatLog } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";


export default function ThreatReportsPage() {
    const { toast } = useToast();
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 8, 1), // Sep 1, 2025
        to: new Date(2025, 8, 13),   // Sep 13, 2025
    });
    
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

    const handleExport = (format: 'PDF' | 'Excel') => {
        // In a real app, you'd use a library like jsPDF, pdf-lib, or xlsx
        // to generate the file based on the 'filteredLogData'.
        console.log(`Exporting data for range:`, date, `to ${format}`);
        console.log('Data to export:', filteredLogData);
        
        toast({
            title: `Exportando a ${format}`,
            description: "Esta función se implementará en el futuro.",
        });
    };

    if (!fullMonthLogData || !filteredLogData) {
        return <p>No threat data available for the selected period.</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-headline">Threat Reports</h1>
                <div className="flex flex-col sm:flex-row gap-2">
                    <DateRangePicker date={date} setDate={setDate} />
                    <Button onClick={() => handleExport('PDF')} variant="outline">
                        <FileDown className="mr-2" />
                        Export PDF
                    </Button>
                     <Button onClick={() => handleExport('Excel')} variant="outline">
                        <FileDown className="mr-2" />
                        Export Excel
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div id="report-preview" className="space-y-6">
                        <h2 className="text-xl font-semibold text-center font-headline">
                            Threat Report Preview
                        </h2>
                        <p className="text-center text-muted-foreground">
                            {`Report for period: ${date?.from ? date.from.toLocaleDateString() : 'N/A'} - ${date?.to ? date.to.toLocaleDateString() : 'N/A'}`}
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
