import { Types } from 'mongoose';

export async function getNodeHistory(nodeId: Types.ObjectId) {
  try {
    const res = await fetch(`/api/nodes/${nodeId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {}
}

export async function addNodeHistory(nodeHistory: any, nodeId: String) {
  try {
    const res = await fetch(`/api/nodes/${nodeId}/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history: nodeHistory }),
    });
    if (!res.ok) {
      throw new Error(`Request failed with ${res.status}`);
    }

    // return whatever the endpoint responds with
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
