export interface MatchFields {
  location: string | null;
  district: string | null;
}

export default function extractMatchFields(item: Record<string, any> | null | undefined): MatchFields {
  if (!item) {
    return { location: null, district: null };
  }

  const location =
    typeof item.location === 'string' && item.location.trim() !== '' ? item.location.trim() : null;

  const district =
    typeof item.district === 'string' && item.district.trim() !== '' ? item.district.trim() : null;

  return { location, district };
}
