const API_URL = "http://localhost:5000/v1";

export async function getData<T>(url: string): Promise<T> {
  const res = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data from API: " + res.statusText);
  }

  return res.json();
}
