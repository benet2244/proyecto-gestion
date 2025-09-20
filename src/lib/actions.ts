'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Incident, ThreatLog, AnalyzeHashInput, AnalyzeHashOutput } from './definitions';
import { analyzeHash as analyzeHashFlow } from '@/ai/flows/analyze-hash-flow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';


async function handleApiResponse(response: Response, entityName: string, expectedStatus: number = 200) {
  if (response.status !== expectedStatus) {
    const errorBody = await response.text();
    console.error(`Error from API for ${entityName} (Status ${response.status}):`, errorBody);
    throw new Error(`Fallo en la operación de ${entityName}.`);
  }
  
  if (response.headers.get('Content-Length') === '0' || response.status === 204) {
      return null;
  }

  // Intenta parsear como JSON, si falla, devuelve el texto.
  const textBody = await response.text();
  try {
      return JSON.parse(textBody);
  } catch (e) {
      console.warn(`API response for ${entityName} was not valid JSON:`, textBody);
      return textBody;
  }
}

// --- INCIDENT ACTIONS ---

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_BASE_URL}/incidents.php`, { cache: 'no-store' });
  return await handleApiResponse(response, 'incidents');
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const response = await fetch(`${API_BASE_URL}/incidents.php?id=${id}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  return await handleApiResponse(response, `incident ${id}`);
}

export async function createIncident(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const response = await fetch(`${API_BASE_URL}/incidents.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
    });

    const newIncident = await handleApiResponse(response, 'incident (create)', 201);
    revalidatePath('/dashboard/incidents');
    redirect(`/dashboard/incidents/${newIncident.id}`);
}

export async function updateIncident(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const response = await fetch(`${API_BASE_URL}/incidents.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
    });

    await handleApiResponse(response, `incident (update)`);
    revalidatePath('/dashboard/incidents');
    revalidatePath(`/dashboard/incidents/${id}`);
    redirect(`/dashboard/incidents/${id}`);
}


// --- THREAT LOG ACTIONS ---

export async function getThreatLogs(): Promise<ThreatLog[]> {
  const response = await fetch(`${API_BASE_URL}/detections.php`, { cache: 'no-store' });
  return await handleApiResponse(response, 'threat-logs');
}

export async function getThreatLogById(id: string): Promise<ThreatLog | null> {
  const response = await fetch(`${API_BASE_URL}/detections.php?id=${id}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  return await handleApiResponse(response, `threat-log ${id}`);
}

export async function createThreatLog(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());
    const response = await fetch(`${API_BASE_URL}/detections.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
    });

    const newLog = await handleApiResponse(response, 'threat-log (create)', 201);
    revalidatePath('/dashboard/threat-log');
    redirect(`/dashboard/threat-log/${newLog.id}`);
}

export async function updateThreatLog(id: string, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    const response = await fetch(`${API_BASE_URL}/detections.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
    });

    await handleApiResponse(response, 'threat-log (update)');
    revalidatePath('/dashboard/threat-log');
    revalidatePath(`/dashboard/threat-log/${id}`);
    redirect(`/dashboard/threat-log/${id}`);
}

// --- GENERIC/SHARED ACTIONS ---

export async function deleteItem(id: string, type: 'incident' | 'threat-log') {
  const endpoint = type === 'incident' ? 'incidents.php' : 'detections.php';
  const response = await fetch(`${API_BASE_URL}/${endpoint}?id=${id}`, {
    method: 'DELETE',
  });
  await handleApiResponse(response, `${type} (delete)`);
  
  const path = type === 'incident' ? '/dashboard/incidents' : '/dashboard/threat-log';
  revalidatePath(path);
  redirect(path);
}


// --- ANALYTICS & REPORTING ACTIONS ---

export async function analyzeHash(input: AnalyzeHashInput): Promise<AnalyzeHashOutput> {
  return await analyzeHashFlow(input);
}

export async function getThreatAnalytics() {
  const response = await fetch(`${API_BASE_URL}/threats_analytic.php`, { cache: 'no-store' });
  return await handleApiResponse(response, 'threat-analytics');
}
