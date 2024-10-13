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
