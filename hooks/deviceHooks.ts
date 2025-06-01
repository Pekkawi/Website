import { Types } from 'mongoose';

export async function getDevices() {
  try {
    const res = await fetch('/api/devices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();

    return data ?? [];
  } catch (err) {
    return undefined;
  }
}

export async function deleteDevice(deviceId: Types.ObjectId) {
  try {
    const res = await fetch(`/api/permissions/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
