import { NextResponse } from 'next/server';
import { getDetectionById, updateDetection, deleteDetection } from '@/lib/data';
import { Detection } from '@/lib/definitions';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const detection = getDetectionById(params.id);
        if (!detection) {
            return NextResponse.json({ message: 'Detection not found' }, { status: 404 });
        }
        return NextResponse.json(detection);
    } catch (error) {
        return NextResponse.json({ message: 'Failed to fetch detection' }, { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const updates: Partial<Detection> = await request.json();
        const updatedDetection = updateDetection(params.id, updates);

        if (!updatedDetection) {
            return NextResponse.json({ message: 'Detection not found' }, { status: 404 });
        }
        return NextResponse.json(updatedDetection);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to update detection' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const success = deleteDetection(params.id);
        if (!success) {
            return NextResponse.json({ message: 'Detection not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Detection deleted' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to delete detection' }, { status: 500 });
    }
}
