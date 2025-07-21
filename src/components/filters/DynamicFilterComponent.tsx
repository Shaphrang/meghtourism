import React, { useState } from "react";
import useDynamicFilterOptions from "@/hooks/useDynamicFilterOptions";
import useSingleFilterState from "@/hooks/useSingleFilterState";
import {
  Landmark,
  MapPin,
  Tag,
  XCircle,
  Utensils,
  Car,
  IndianRupee,
  Calendar,
} from "lucide-react";

type FilterType =
  | "location"
  | "district"
  | "tags"
  | "cuisine"
  | "carType"
  | "price"
  | "days";

interface FilterConfig {
  type: FilterType;
  field?: string; // override db field if different from type
}

interface Props {
  table: string;
  filtersConfig: FilterConfig[];
  onFilterChange: (newFilter: { field: string; value: any } | null) => void;
}

export default function DynamicFilterComponent({ table, filtersConfig, onFilterChange }: Props) {
  const options = useDynamicFilterOptions(table);
  const { filter, updateFilter, resetFilter } = useSingleFilterState();

  const [activeFilterType, setActiveFilterType] = useState<FilterType | null>(null);

  const handleSelectValue = (field: string, value: any) => {
    updateFilter(field, value);
    onFilterChange({ field, value });
    setActiveFilterType(null);
  };

  const handleReset = () => {
    resetFilter();
    onFilterChange(null);
    setActiveFilterType(null);
  };

    const priceRanges = [
    { label: "Below ₹1,000", value: { lte: 1000 } },
    { label: "₹1,000 – ₹2,000", value: { gte: 1000, lte: 2000 } },
    { label: "₹2,000 – ₹4,000", value: { gte: 2000, lte: 4000 } },
    { label: "Above ₹4,000", value: { gte: 4000 } },
  ];

  const daysRanges = [
    { label: "1-3 Days", value: { gte: 1, lte: 3 } },
    { label: "4-7 Days", value: { gte: 4, lte: 7 } },
    { label: "8-10 Days", value: { gte: 8, lte: 10 } },
    { label: ">10 Days", value: { gte: 11 } },
  ];

  const getOptions = (type: FilterType) => {
    switch (type) {
      case "district":
        return options.districts;
      case "location":
        return options.locations;
      case "tags":
        return options.tags;
      case "cuisine":
        return options.cuisines;
      case "carType":
        return options.carTypes;
      case "price":
        return priceRanges;
      case "days":
        return daysRanges;
      default:
        return [];
    }
  };

  const cfgField = (type: FilterType) => {
    const cfg = filtersConfig.find((f) => f.type === type);
    return cfg?.field || type;
  };


  return (
    <section className="bg-white shadow-md border-b px-4 py-4">
      <div className="flex flex-wrap justify-center gap-2">
                {filtersConfig.map((cfg) => {
          const isActive = filter?.field === (cfg.field || cfg.type);
          const label = cfg.type.charAt(0).toUpperCase() + cfg.type.slice(1);
          const icon = {
            district: <Landmark size={18} />,
            location: <MapPin size={18} />,
            tags: <Tag size={18} />,
            cuisine: <Utensils size={18} />,
            carType: <Car size={18} />,
            price: <IndianRupee size={18} />,
            days: <Calendar size={18} />,
          }[cfg.type];
                    return (
            <button
              key={cfg.type}
              onClick={() =>
                setActiveFilterType(activeFilterType === cfg.type ? null : cfg.type)
              }
              className={`flex flex-col items-center px-3 py-2 rounded-full ${
                isActive ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800"
              } font-medium text-sm shadow transition`}
            >
              {icon}
              <span>{label}</span>
            </button>
          );
        })}

        <button
          onClick={handleReset}
          className="flex flex-col items-center px-3 py-2 rounded-full bg-gray-200 text-gray-700 font-medium text-sm shadow transition"
        >
          <XCircle size={18} />
          <span>Reset</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-3">
                {activeFilterType && getOptions(activeFilterType).length === 0 && (
          <span className="text-sm text-gray-500">No filters available</span>
        )}

        {activeFilterType === "district" &&
          options.districts.map((d) => (
            <button
              key={d}
              onClick={() => handleSelectValue(cfgField("district"), d)}
              className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
            >
              {d}
            </button>
          ))}

        {activeFilterType === "location" &&
          options.locations.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelectValue(cfgField("location"), loc)}
              className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm hover:bg-blue-100 transition"
            >
              {loc}
            </button>
          ))}

        {activeFilterType === "tags" &&
          options.tags.map((t) => (
            <button
              key={t}
              onClick={() => handleSelectValue(cfgField("tags"), t)}
              className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 text-sm hover:bg-yellow-100 transition"
            >
              {t}
            </button>
          ))}

        {activeFilterType === "cuisine" &&
          options.cuisines.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectValue(cfgField("cuisine"), c)}
              className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
            >
              {c}
            </button>
          ))}

        {activeFilterType === "carType" &&
          options.carTypes.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectValue(cfgField("carType"), c)}
              className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
            >
              {c}
            </button>
          ))}

        {activeFilterType === "price" &&
          priceRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => handleSelectValue(cfgField("price"), r.value)}
              className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
            >
              {r.label}
            </button>
          ))}

        {activeFilterType === "days" &&
          daysRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => handleSelectValue(cfgField("days"), r.value)}
              className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm hover:bg-green-100 transition"
            >
              {r.label}
            </button>
          ))}
      </div>
    </section>
  );
}
