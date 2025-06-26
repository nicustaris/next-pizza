"use client";

import React from "react";

import { Title } from "./title";
import { Button } from "../ui";
import PizzaImage from "./pizza-image";
import { GroupVariants } from "./group-variants";
import { PizzaSize, PizzaType, pizzaTypes } from "@/shared/constants/pizza";
import { Ingredient, ProductVariant } from "@prisma/client";
import IngredientItem from "./ingredient-item";
import { cn } from "@/shared/lib/utils";
import { usePizzaOptions } from "@/shared/hooks";
import { getPizzaDetails } from "@/shared/lib";

interface Props {
  name: string;
  imageUrl: string;
  ingredients: Ingredient[];
  variants: ProductVariant[];
  loading: boolean;
  onSubmit: (itemId: number, ingredients: number[]) => void;
  className?: string;
}

/**
 * PIZZA selection form
 */

export const ChoosePizzaForm: React.FC<Props> = ({
  imageUrl,
  name,
  ingredients,
  variants,
  loading,
  onSubmit,
  className,
}) => {
  const {
    size,
    type,
    setSize,
    setType,
    selectedIngredients,
    addIngredient,
    availableSizes,
    currentItemId,
  } = usePizzaOptions(variants);

  const { totalPrice, textDetails } = getPizzaDetails(
    size,
    type,
    variants,
    ingredients,
    selectedIngredients,
  );

  const handleClickAdd = () => {
    if (currentItemId) {
      onSubmit(currentItemId, Array.from(selectedIngredients));
    }
  };

  return (
    <div className={cn("flex flex-1", className)}>
      <PizzaImage imageUrl={imageUrl} size={size} />

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} className="font-extrabold mt-1" />

        <p className="text-gray-400">{textDetails}</p>

        <div className="flex flex-col gap-4 mt-5">
          <GroupVariants
            variants={availableSizes}
            value={String(size)}
            onClick={(value) => setSize(Number(value) as PizzaSize)}
          />

          <GroupVariants
            variants={pizzaTypes}
            value={String(type)}
            onClick={(value) => setType(Number(value) as PizzaType)}
          />
        </div>

        <div className="h-[420px] mt-5 p-5 rounded-md bg-gray-50 overflow-auto scrollbar">
          <div className="grid grid-cols-3 gap-3">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                name={ingredient.name}
                imageUrl={ingredient.imageUrl}
                price={ingredient.price}
                onClick={() => addIngredient(ingredient.id)}
                active={selectedIngredients.has(ingredient.id)}
              />
            ))}
          </div>
        </div>

        <Button
          onClick={handleClickAdd}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
          loading={loading}
        >
          Add to basket £{totalPrice}
        </Button>
      </div>
    </div>
  );
};
