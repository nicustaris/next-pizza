import React from "react";
import { WhiteBlock } from "../white-block";
import { CheckoutItemSkeleton } from "../checkout-item-skeleton";
import { CheckoutItem } from "../checkout-item";

import { getCartItemDetails } from "@/shared/lib";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { CartStateItem } from "@/shared/lib/get-cart-details";

interface Props {
  items: CartStateItem[];
  loading?: boolean;
  onClickCountButton: (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => void;
  removeCartItem: (id: number) => void;
  className?: string;
}

export const CheckoutCart: React.FC<Props> = ({
  items,
  loading,
  onClickCountButton,
  removeCartItem,
  className,
}) => {
  return (
    <WhiteBlock title="1. Basket" className={className}>
      <div className="flex flex-col gap-5">
        {loading &&
          [...Array(4)].map((_, index) => <CheckoutItemSkeleton key={index} />)}

        {items.map((item) => (
          <CheckoutItem
            key={item.id}
            id={item.id}
            imageUrl={item.imageUrl}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            disabled={item.disabled}
            details={getCartItemDetails(
              item.pizzaSize as PizzaSize,
              item.type as PizzaType,
              item.ingredients,
            )}
            onClickCountButton={(type) =>
              onClickCountButton(item.id, item.quantity, type)
            }
            onClickRemove={() => removeCartItem(item.id)}
          />
        ))}
      </div>
    </WhiteBlock>
  );
};
