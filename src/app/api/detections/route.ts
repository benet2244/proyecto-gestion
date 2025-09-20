import { NextResponse } from 'next/server';
import { getDetections, addDetection } from '@/lib/data';
import { Detection } from '@/lib/definitions';

export async function GET() {
    try {
        const detections = getDetections();
        return NextResponse.json(detections);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch detections' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newDetectionData: Omit<Detection, 'id'> = await request.json();
        const newDetection = addDetection(newDetectionData);
        return NextResponse.json(newDetection, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create detection' }, { status: 500 });
    }
}
