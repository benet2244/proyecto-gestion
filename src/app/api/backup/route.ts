import { NextResponse } from 'next/server';
import { incidents, detections } from '@/lib/data';

export async function GET() {
    try {
        const backupData = {
            incidents,
            detections,
        };

        const jsonString = JSON.stringify(backupData, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Content-Disposition', `attachment; filename="ciberseg-vistazo-backup-${timestamp}.json"`);

        return new NextResponse(jsonString, { headers });

    } catch (error) {
        console.error("Failed to create backup:", error);
        return NextResponse.json({ message: 'Failed to create backup' }, { status: 500 });
    }
}
