// src/lib/fetchData.ts
export async function fetchData<T>(fileName: string): Promise<T> {
  try {
    const response = await fetch(`/data/${fileName}`);
    if (!response.ok) throw new Error(`Failed to load ${fileName}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
