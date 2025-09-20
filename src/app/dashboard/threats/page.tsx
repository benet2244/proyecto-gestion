
import ThreatsLog from '@/components/threats/threats-log';
import { sampleThreatLogs } from '@/lib/data/threats';

export default function ThreatsLogPage() {
    // For now, we'll use sample data for a specific month and year.
    // In the future, this will be dynamic.
    const logData = sampleThreatLogs.find(log => log.year === 2025 && log.month === 9);

    return (
        <div className="space-y-6">
            <ThreatsLog initialLogData={logData} />
        </div>
    );
}
