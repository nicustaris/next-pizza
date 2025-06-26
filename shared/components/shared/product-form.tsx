"use client";

import React from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/shared/store";
import { ChoosePizzaForm } from "./choose-pizza-form";
import { ChooseProductForm } from "./choose-product-form";
import { ProductWithRelations } from "@/@types/prisma";

interface Props {
  product: ProductWithRelations;
  onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({
  product,
  onSubmit: _onSubmit,
}) => {
  const { addCartItem, loading } = useCartStore((state) => state);
  const firstItem = product.variants[0];
  const isPizzaForm = Boolean(product.variants[0].pizzaType);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem.id;
      await addCartItem({
        productItemId: itemId,
        ingredients,
      });
      toast.success(product.name + " added in the basket");

      _onSubmit?.();
    } catch {
      toast.error("Could not add in the basket");
    }
  };

  if (isPizzaForm)
    return (
      <ChoosePizzaForm
        imageUrl={product.imageUrl}
        name={product.name}
        ingredients={product.ingredients}
        variants={product.variants}
        onSubmit={onSubmit}
        loading={loading}
      />
    );

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      price={firstItem.price}
      onSubmit={onSubmit}
      loading={loading}
    />
  );
};
