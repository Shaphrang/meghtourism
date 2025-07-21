import React, { useState } from "react";
import useDynamicFilterOptions from "@/hooks/useDynamicFilterOptions";
import useSingleFilterState from "@/hooks/useSingleFilterState";
import { Landmark, MapPin, Tag, XCircle } from "lucide-react";

interface FilterConfig {
  type: "location" | "district" | "tags";
}

interface Props {
  table: string;
  filtersConfig: FilterConfig[];
  onFilterChange: (newFilter: { field: string; value: any } | null) => void;
}

export default function DynamicFilterComponent({ table, filtersConfig, onFilterChange }: Props) {
  const options = useDynamicFilterOptions(table);
  const { filter, updateFilter, resetFilter } = useSingleFilterState();

  const [activeFilterType, setActiveFilterType] = useState<"location" | "district" | "tags" | null>(null);

  const handleSelectValue = (field: string, value: string) => {
    updateFilter(field, value);
    onFilterChange({ field, value });
    setActiveFilterType(null);
  };

  const handleReset = () => {
    resetFilter();
    onFilterChange(null);
    setActiveFilterType(null);
  };

  return (
    <section className="bg-white shadow-md border-b px-4 py-4">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActiveFilterType(activeFilterType === "district" ? null : "district")}
          className={`flex flex-col items-center px-3 py-2 rounded-full ${filter?.field === "district" ? "bg-green-500 text-white" : "bg-green-100 text-green-800"} font-medium text-sm shadow transition`}
        >
          <Landmark size={18} />
          <span>District</span>
          {filter?.field === "district" && <span className="text-xs mt-1">{filter.value}</span>}
        </button>

        <button
          onClick={() => setActiveFilterType(activeFilterType === "location" ? null : "location")}
          className={`flex flex-col items-center px-3 py-2 rounded-full ${filter?.field === "location" ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"} font-medium text-sm shadow transition`}
        >
          <MapPin size={18} />
          <span>Location</span>
          {filter?.field === "location" && <span className="text-xs mt-1">{filter.value}</span>}
        </button>

        <button
          onClick={() => setActiveFilterType(activeFilterType === "tags" ? null : "tags")}
          className={`flex flex-col items-center px-3 py-2 rounded-full ${filter?.field === "tags" ? "bg-yellow-500 text-white" : "bg-yellow-100 text-yellow-800"} font-medium text-sm shadow transition`}
        >
          <Tag size={18} />
          <span>Tags</span>
          {filter?.field === "tags" && <span className="text-xs mt-1">{filter.value}</span>}
        </button>

        <button
          onClick={handleReset}
          className="flex flex-col items-center px-3 py-2 rounded-full bg-gray-200 text-gray-700 font-medium text-sm shadow transition"
        >
          <XCircle size={18} />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
        {activeFilterType === "district" && options.districts.map((d) => (
          <button
            key={d}
            onClick={() => handleSelectValue("district", d)}
            className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
          >
            {d}
          </button>
        ))}
        {activeFilterType === "location" && options.locations.map((loc) => (
          <button
            key={loc}
            onClick={() => handleSelectValue("location", loc)}
            className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm hover:bg-blue-100 transition"
          >
            {loc}
          </button>
        ))}
        {activeFilterType === "tags" && options.tags.map((t) => (
          <button
            key={t}
            onClick={() => handleSelectValue("tags", t)}
            className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 text-sm hover:bg-yellow-100 transition"
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}
