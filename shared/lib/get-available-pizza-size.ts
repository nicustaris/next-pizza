import { ProductVariant } from "@prisma/client";
import { pizzaSizes, PizzaType } from "../constants/pizza";
import { Variant } from "../components/shared/group-variants";

export const getAvailablePizzaSizes = (
  variants: ProductVariant[],
  type: PizzaType,
): Variant[] => {
  const filteredPizzasByType = variants.filter(
    (variant) => variant.pizzaType === type,
  );
  return pizzaSizes.map((variant) => ({
    name: variant.name,
    value: variant.value,
    disabled: !filteredPizzasByType.some(
      (pizza) => Number(pizza.size) === Number(variant.value),
    ),
  }));
};
