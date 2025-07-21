import { useState } from "react";

export default function useSingleFilterState() {
  const [filter, setFilter] = useState<{ field: string; value: any } | null>(null);

  const updateFilter = (field: string, value: any) => {
    setFilter({ field, value });
  };

  const resetFilter = () => {
    setFilter(null);
  };

  return { filter, updateFilter, resetFilter };
}
