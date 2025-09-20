import ThreatsByCategoryChart from "@/components/threats/charts/threats-by-category-chart";
import ThreatsTrendChart from "@/components/threats/charts/threats-trend-chart";
import { sampleThreatLogs } from "@/lib/data/threats";


export default function ThreatAnalyticsPage() {
    const logData = sampleThreatLogs.find(log => log.year === 2025 && log.month === 9);

    if (!logData) {
        return <p>No threat data available for the selected period.</p>
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <ThreatsByCategoryChart logData={logData} />
                </div>
                <div className="lg:col-span-3">
                    <ThreatsTrendChart logData={logData} />
                </div>
            </div>
        </div>
    )
}