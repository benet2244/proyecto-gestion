import { NextResponse } from 'next/server';
import { getIncidents, addIncident } from '@/lib/data';
import { Incident } from '@/lib/definitions';

// In a real app, you'd connect to a database here.

export async function GET() {
  try {
    const incidents = getIncidents();
    return NextResponse.json(incidents);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch incidents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const newIncidentData: Omit<Incident, 'id' | 'reportedAt'> = await request.json();
        const newIncident = addIncident(newIncidentData);
        return NextResponse.json(newIncident, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to create incident' }, { status: 500 });
    }
}
