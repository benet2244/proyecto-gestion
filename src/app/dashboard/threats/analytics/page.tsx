
'use client';

import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";

import ThreatsByCategoryPieChart from "@/components/threats/charts/threats-by-category-pie-chart";
import ThreatsTrendChart from "@/components/threats/charts/threats-trend-chart";
import { sampleThreatLogs } from "@/lib/data/threats";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import ThreatSummaryCard from "@/components/threats/threat-summary-card";
import ThreatDetailsTable from "@/components/threats/threat-details-table";
import { MonthlyThreatLog } from "@/lib/definitions";


export default function ThreatAnalyticsPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2025, 8, 1), // Sep 1, 2025
        to: new Date(2025, 8, 13),   // Sep 13, 2025
    });
    
    // For now, we use the full month data regardless of the date picker.
    // In the future, we'll filter this data based on the selected 'date' state.
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


    if (!fullMonthLogData) {
        return <p>No base threat data available for the selected period.</p>
    }
    
    if (!filteredLogData) {
        return <p>No threat data available for the selected period.</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-headline">Threats Analytics</h1>
                <DateRangePicker date={date} setDate={setDate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <ThreatsByCategoryPieChart logData={filteredLogData} />
                </div>
                 <div className="lg:col-span-2">
                    <ThreatSummaryCard logData={filteredLogData} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <div>
                    <ThreatsTrendChart logData={filteredLogData} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <ThreatDetailsTable logData={filteredLogData} fullMonthLogData={fullMonthLogData}/>
                </div>
            </div>

        </div>
    )
}
