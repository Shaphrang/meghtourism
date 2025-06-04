export async function fetchData(filename: string) {
  const res = await fetch(`/data/${filename}`);
  if (!res.ok) throw new Error('Failed to load data');
  return res.json();
}
