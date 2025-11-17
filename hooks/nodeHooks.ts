import { BambuNodeFormData } from '@/zodSchemas/BambuNodeFormSchema';

export async function getNodes() {
  try {
    const res = await fetch('/api/nodes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return err;
  }
}

export async function updateNodeSettings(nodeId: string, formData: BambuNodeFormData) {
  try {
    const res = await fetch(`/api/nodes/${nodeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}`);
    }

    // return whatever the endpoint responds with
    return await res.json();
  } catch (err) {
    return err;
  }
}
