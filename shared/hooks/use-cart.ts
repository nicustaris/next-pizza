import React from "react";
import { useCartStore } from "../store";
import { CartStateItem } from "../lib/get-cart-details";

type ReturnProps = {
  updateItemQuantity: (id: number, quantity: number) => void;
  items: CartStateItem[];
  totalAmount: number;
  removeCartItem: (id: number) => void;
  loading: boolean;
};

export const useCart = (): ReturnProps => {
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const items = useCartStore((state) => state.items);
  const totalAmount = useCartStore((state) => state.totalAmount);
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const loading = useCartStore((state) => state.loading);

  React.useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    updateItemQuantity,
    items,
    totalAmount,
    removeCartItem,
    loading,
  };
};
