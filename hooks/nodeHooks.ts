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
