'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteItem(id: string, type: 'incident' | 'detection') {
    const endpoint = type === 'incident' ? 'incidents' : 'detections';
    
    // In a real app, you would make a DELETE request to your API
    // const res = await fetch(`http://localhost:3000/api/${endpoint}/${id}`, { method: 'DELETE' });
    // For now, we simulate the deletion.
    console.log(`Simulating deletion of ${type} with id: ${id}`);
    
    // if (!res.ok) {
    //   throw new Error(`Failed to delete ${type}`);
    // }

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/${endpoint}`);
    
    // Optionally, you can redirect, but revalidating is often enough
    // redirect(`/dashboard/${endpoint}`);

    return { message: `${type} ${id} deleted successfully` };
}
