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
      if (table === "cafesRestaurants") columns += ", cuisine";
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
        if (item?.location && item.location !== "") locSet.add(item.location);
        if (item?.district && item.district !== "") districtSet.add(item.district);
        if (item?.cuisine && item.cuisine !== "") cuisineSet.add(item.cuisine);
        if (item?.carType && item.carType !== "") carTypeSet.add(item.carType);
        if (item?.tags && Array.isArray(item.tags)) {
          item.tags.forEach((t: string) => {
            if (t && t !== "") tagSet.add(t);
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
