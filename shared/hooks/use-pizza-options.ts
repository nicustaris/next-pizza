import React from "react";
import { useSet } from "react-use";

import { Variant } from "../components/shared/group-variants";
import { PizzaSize, PizzaType } from "../constants/pizza";
import { getAvailablePizzaSizes } from "../lib/get-available-pizza-size";
import { ProductVariant } from "@prisma/client";

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  setSize: (size: PizzaSize) => void;
  setType: (type: PizzaType) => void;
  selectedIngredients: Set<number>;
  addIngredient: (id: number) => void;
  availableSizes: Variant[];
  currentItemId?: number;
}

export const usePizzaOptions = (variants: ProductVariant[]): ReturnProps => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<number>([]),
  );

  const availableSizes = getAvailablePizzaSizes(variants, type);

  const currentItemId = variants.find(
    (variant) => variant.pizzaType === type && variant.size === size,
  )?.id;

  React.useEffect(() => {
    const isAvailableSize = availableSizes?.find(
      (variant) => Number(variant.value) === size && !variant.disabled,
    );

    const availableSize = availableSizes?.find((variant) => !variant.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type]);

  return {
    size,
    type,
    setSize,
    setType,
    selectedIngredients,
    addIngredient,
    availableSizes,
    currentItemId,
  };
};
