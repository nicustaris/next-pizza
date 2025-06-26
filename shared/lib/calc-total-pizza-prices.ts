import { Ingredient, ProductVariant } from "@prisma/client";
import { PizzaSize, PizzaType } from "../constants/pizza";

/**
 * Calculates the total price of a pizza
 * Based on selected size, type, and ingredients.
 *
 * @param variants - List of all available pizza variants.
 * @param ingredients - List of all ingredients.
 * @param size - The selected size of the pizza.
 * @param type - The selected type of the pizza.
 * @param selectedIngredients - Set of chosen ingredient IDs.
 *
 * @returns The total price of the pizza.
 */

export const calcTotalPizzaPrice = (
  variants: ProductVariant[],
  ingredients: Ingredient[],
  size: PizzaSize,
  type: PizzaType,
  selectedIngredients: Set<number>,
) => {
  const pizzaPrice =
    variants.find(
      (variant) => variant.pizzaType === type && variant.size === size,
    )?.price ?? 0;

  const totalIngredientPrice = ingredients
    .filter((ingredient) => selectedIngredients.has(ingredient.id))
    .reduce((acc, ingredient) => acc + ingredient.price, 0);

  return pizzaPrice + totalIngredientPrice;
};
