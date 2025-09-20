import { NextResponse } from 'next/server';
import { getIncidentById, updateIncident, deleteIncident } from '@/lib/data';
import { Incident } from '@/lib/definitions';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incident = getIncidentById(params.id);
    if (!incident) {
      return NextResponse.json({ message: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json(incident);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch incident' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
    try {
        const updates: Partial<Incident> = await request.json();
        const updatedIncident = updateIncident(params.id, updates);

        if (!updatedIncident) {
            return NextResponse.json({ message: 'Incident not found' }, { status: 404 });
        }
        return NextResponse.json(updatedIncident);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to update incident' }, { status: 500 });
    }
}


export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const success = deleteIncident(params.id);
        if (!success) {
            return NextResponse.json({ message: 'Incident not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Incident deleted successfully' });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to delete incident' }, { status: 500 });
    }
}
