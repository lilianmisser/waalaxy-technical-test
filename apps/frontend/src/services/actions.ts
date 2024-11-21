const BASE_URL = 'http://localhost:3000';

export function getState() {
  return fetch(`${BASE_URL}/state`).then((response) =>
    response.json()
  ) as Promise<{
    credits: Record<string, number>;
    actions: string[];
  }>;
}

export function addAction(action: string) {
  return fetch(`${BASE_URL}/actions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action }),
  });
}
