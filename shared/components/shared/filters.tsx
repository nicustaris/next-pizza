"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import CheckboxFiltersGroup from "./checkbox-filters-group";
import { useFilters, useIngredients, useQueryFilters } from "@/shared/hooks";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useIngredients();
  const filters = useFilters();

  useQueryFilters(filters);

  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  const updatePrice = (prices: number[]) => {
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  };

  return (
    <div className={cn(className)}>
      <Title text="Filter" size="sm" className="mb-5 font-bold" />

      {/* Top checkbox */}
      <CheckboxFiltersGroup
        title="Type"
        name="pizzaType"
        className="mb-5"
        onClickCheckbox={filters.setPizzaTypes}
        selected={filters.pizzaTypes}
        items={[
          { text: "Thin Crust", value: "1" },
          { text: "Traditional", value: "2" },
        ]}
      />

      <CheckboxFiltersGroup
        title="Sizes"
        name="sizes"
        className="mb-5"
        onClickCheckbox={filters.setSizes}
        selected={filters.sizes}
        items={[
          { text: "20 cm", value: "20" },
          { text: "30 cm", value: "30" },
          { text: "40 cm", value: "40" },
        ]}
      />

      {/* Filter price */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Price from to:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={100}
            max={1000}
            placeholder="1000"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[
            filters.prices.priceFrom || 0,
            filters.prices.priceTo || 1000,
          ]}
          onValueChange={updatePrice}
        />
      </div>

      <CheckboxFiltersGroup
        title="Ingredients"
        name="ingredients"
        className="mt-5"
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
      />
    </div>
  );
};

export default Filters;
