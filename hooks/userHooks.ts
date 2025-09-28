import { UserType } from '@/interfaces/userpage.interfaces';

export async function getUsers(): Promise<UserType[] | undefined> {
  try {
    const res = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return undefined;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${id}`, {
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

export async function getUserDetails(id: string) {
  try {
    const res = await fetch(`/api/users/${id}`, {
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
