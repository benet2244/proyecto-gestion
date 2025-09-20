import { NextResponse } from 'next/server';
import { incidentStructure, detectionStructure } from '@/lib/data-structures';

export async function GET() {
    try {
        const systemStructure = {
            description: "This JSON describes the data models for the CiberSeg Vistazo application.",
            models: {
                incident: incidentStructure,
                detection: detectionStructure,
            }
        };

        const jsonString = JSON.stringify(systemStructure, null, 2);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('Content-Disposition', `attachment; filename="ciberseg-vistazo-structure-${timestamp}.json"`);

        return new NextResponse(jsonString, { headers });

    } catch (error) {
        console.error("Failed to create structure backup:", error);
        return NextResponse.json({ message: 'Failed to create structure backup' }, { status: 500 });
    }
}
