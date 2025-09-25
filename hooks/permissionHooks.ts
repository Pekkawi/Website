import { IPerm } from '@/interfaces/database.interfaces';
import { ObjectId } from 'mongoose';

export async function getPermissions() {
  try {
    const res = await fetch('/api/permissions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();

    return data;
  } catch (err) {
    return undefined;
  }
}

export async function deletePermission(permId: string) {
  try {
    const res = await fetch(`/api/permissions/${permId}`, {
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

export async function updatePermission(permId: string, data: Partial<IPerm>) {
  const response = await fetch(`/api/permissions/${permId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update permission');
  return response.json();
}
