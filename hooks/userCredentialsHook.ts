import { IUserCredential } from '@/database/usercredential.model';
import { ObjectId } from 'mongoose';

export async function getUserCredentials() {
  try {
    const res = await fetch('/api/user_credentials', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      return undefined;
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    return undefined;
  }
}

export async function deleteUserCredentials(userCredentialId: ObjectId) {
  try {
    const res = await fetch(`/api/user_credentials/${userCredentialId}`, {
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

export async function editUserCredentialRole(newRole: string, userCredentialId: string) {
  const res = await fetch(`/api/user_credentials/${userCredentialId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: newRole }),
  });
  if (!res.ok) {
    throw new Error('Could not edit user role');
  }
  return res.json();
}
