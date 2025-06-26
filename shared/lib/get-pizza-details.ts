import { Ingredient, ProductVariant } from "@prisma/client";
import { mapPizzaType, PizzaSize, PizzaType } from "../constants/pizza";
import { calcTotalPizzaPrice } from "./calc-total-pizza-prices";

export const getPizzaDetails = (
  size: PizzaSize,
  type: PizzaType,
  variants: ProductVariant[],
  ingredients: Ingredient[],
  selectedIngredients: Set<number>,
) => {
  const totalPrice = calcTotalPizzaPrice(
    variants,
    ingredients,
    size,
    type,
    selectedIngredients,
  );

  const textDetails = `${size} cm, ${mapPizzaType[type]} Pizza`;

  return {
    totalPrice,
    textDetails,
  };
};
