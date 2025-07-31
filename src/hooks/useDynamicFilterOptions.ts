import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function useDynamicFilterOptions(table: string) {
  const supabase = createClientComponentClient();
  const [options, setOptions] = useState<{
    locations: string[];
    districts: string[];
    tags: string[];
    cuisines: string[];
    carTypes: string[];
  }>({
    locations: [],
    districts: [],
    tags: [],
    cuisines: [],
    carTypes: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      console.log("🔎 Fetching filter options from table:", table);

      let columns = "location";
      if (table === "destinations") columns += ", district, tags";
      if (table === "cafes_and_restaurants") columns += ", cuisine";
      if (table === "rentals") columns += ", carType";

      const { data, error } = await supabase
        .from(table)
        .select(columns);

      if (error) {
        console.error("❌ Supabase error fetching options:", error);
        return;
      }

      console.log("✅ Raw data fetched:", data);

      const locSet = new Set<string>();
      const districtSet = new Set<string>();
      const tagSet = new Set<string>();
      const cuisineSet = new Set<string>();
      const carTypeSet = new Set<string>();

      data?.forEach((item: any) => {
        // Location
        if (item?.location && item.location.trim() !== "") locSet.add(item.location.trim());

        // District
        if (item?.district && item.district.trim() !== "") districtSet.add(item.district.trim());

        // Cuisine - PATCH: handle both array and string
        if (item?.cuisine) {
          if (Array.isArray(item.cuisine)) {
            item.cuisine.forEach((c: string) => {
              if (c && c.trim() !== "") cuisineSet.add(c.trim());
            });
          } else if (typeof item.cuisine === "string" && item.cuisine.trim() !== "") {
            cuisineSet.add(item.cuisine.trim());
          }
        }

        // Car Type
        if (item?.carType && item.carType.trim() !== "") carTypeSet.add(item.carType.trim());

        // Tags
        if (item?.tags && Array.isArray(item.tags)) {
          item.tags.forEach((t: string) => {
            if (t && t.trim() !== "") tagSet.add(t.trim());
          });
        }
      });

      console.log("✅ Unique locations:", [...locSet]);
      console.log("✅ Unique districts:", [...districtSet]);
      console.log("✅ Unique tags:", [...tagSet]);
      console.log("✅ Unique cuisines:", [...cuisineSet]);
      console.log("✅ Unique car types:", [...carTypeSet]);

      setOptions({
        locations: [...locSet].sort(),
        districts: [...districtSet].sort(),
        tags: [...tagSet].sort(),
        cuisines: [...cuisineSet].sort(),
        carTypes: [...carTypeSet].sort(),
      });
    };

    fetchOptions();
  }, [table]);

  return options;
}
