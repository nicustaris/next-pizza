import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Filters } from "./use-filters";
import qs from "qs";

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();
  const currentParams = useSearchParams();
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
      const filterParams = {
        ...filters.prices,
        pizzaTypes: Array.from(filters.pizzaTypes),
        sizes: Array.from(filters.sizes),
        ingredients: Array.from(filters.selectedIngredients),
      };

      const query = qs.stringify(filterParams, { arrayFormat: "comma" });
      const currentQuery = currentParams.toString();

      if (currentQuery !== query) {
        router.push(`?${query}`, {
          scroll: false,
        });
      }
    }
    isMounted.current = true;
  }, [filters, router]);
};
