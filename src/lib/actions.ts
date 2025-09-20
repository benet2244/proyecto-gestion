"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Incident, Detection } from "./definitions";

// --- CONFIGURACIÓN ---
// Usar el DNS especial de Docker para alcanzar el host y el puerto mapeado (8080)
const API_BASE_URL = "http://host.docker.internal:8080/backend";

// --- HELPERS ---

async function handleApiResponse(response: Response, entityName: string) {
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error from API for ${entityName}:`, errorBody);
    throw new Error(
      `Failed to perform operation on ${entityName}. Status: ${response.status}.\nError: ${errorBody}`
    );
  }
  return response.json();
}

// --- ACCIONES PARA INCIDENTES ---

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_BASE_URL}/incidents.php`, {
    cache: "no-store",
  });
  return handleApiResponse(response, "incidents");
}

export async function getIncidentById(id: string): Promise<Incident> {
  const response = await fetch(`${API_BASE_URL}/incidents.php?id=${id}`, {
    cache: "no-store",
  });
  return handleApiResponse(response, "incident");
}

export async function saveIncident(formData: FormData) {
  const id = formData.get("id") as string | null;
  const rawData = Object.fromEntries(formData.entries());

  const workstream = formData.getAll('workstreamAssignment');
  const dataToSave = { ...rawData, workstreamAssignment: workstream };

  const url = id
    ? `${API_BASE_URL}/incidents.php?id=${id}`
    : `${API_BASE_URL}/incidents.php`;
  const method = id ? "PUT" : "POST";

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dataToSave),
  });

  await handleApiResponse(response, "incident");

  revalidatePath("/dashboard/incidents");
  redirect("/dashboard/incidents");
}

export async function deleteIncident(id: string) {
    const response = await fetch(`${API_BASE_URL}/incidents.php?id=${id}`, {
        method: 'DELETE',
    });
    await handleApiResponse(response, 'incident');
    revalidatePath('/dashboard/incidents');
    return { message: `Incidente ${id} eliminado.` };
}


// --- ACCIONES PARA DETECCIONES ---

export async function getDetections(): Promise<Detection[]> {
  const response = await fetch(`${API_BASE_URL}/detections.php`, {
    cache: "no-store",
  });
  return handleApiResponse(response, "detections");
}

export async function getDetectionById(id: string): Promise<Detection> {
  const response = await fetch(`${API_BASE_URL}/detections.php?id=${id}`, {
    cache: "no-store",
  });
  return handleApiResponse(response, "detection");
}

export async function saveDetection(formData: FormData) {
  const id = formData.get("id") as string | null;
  const rawData = Object.fromEntries(formData.entries());

  const url = id
    ? `${API_BASE_URL}/detections.php?id=${id}`
    : `${API_BASE_URL}/detections.php`;
  const method = id ? "PUT" : "POST";

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rawData),
  });

  await handleApiResponse(response, "detection");

  revalidatePath("/dashboard/detections");
  redirect("/dashboard/detections");
}

export async function deleteDetection(id: string) {
    const response = await fetch(`${API_BASE_URL}/detections.php?id=${id}`, {
        method: 'DELETE',
    });
    await handleApiResponse(response, 'detection');
    revalidatePath('/dashboard/detections');
    return { message: `Detección ${id} eliminada.` };
}


export async function deleteItem(id: string, type: 'incident' | 'detection') {
    if (type === 'incident') {
        return deleteIncident(id);
    } else {
        return deleteDetection(id);
    }
}
