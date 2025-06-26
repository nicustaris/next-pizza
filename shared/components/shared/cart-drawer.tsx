"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import Link from "next/link";
import { Button } from "../ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CartDrawerItem } from "./cart-drawer-item";
import { getCartItemDetails } from "@/shared/lib";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { Title } from "./title";
import { useCart } from "@/shared/hooks";

interface Props {
  className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const { updateItemQuantity, items, totalAmount, removeCartItem, loading } =
    useCart();

  const [redirecting, setRedirecting] = React.useState(false);

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus",
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col justify-between bg-[#F4F1EE]">
        <div
          className={cn(
            "flex flex-col h-full",
            !totalAmount && "justify-center",
          )}
        >
          {totalAmount > 0 && (
            <SheetHeader>
              <SheetTitle>
                In the basket
                <span className="font-bold">{items.length} item</span>
              </SheetTitle>
            </SheetHeader>
          )}

          {!totalAmount && (
            <div className="flex flex-col items-center justify-center w-72 mx-auto">
              <Image
                src="/assets/images/empty-box.png"
                alt="Empty cart"
                width={120}
                height={120}
              />

              <Title
                size="sm"
                text="Empty cart"
                className="text-center font-bold my-2"
              />

              <SheetTitle className="text-neutral-500 mb-5">
                Add at least one pizza to complete the order
              </SheetTitle>

              <SheetClose asChild>
                <Button className="w-56 h-12 text-base " size="lg">
                  <ArrowLeft className="w-5 mr-2" />
                  Go back
                </Button>
              </SheetClose>
            </div>
          )}

          {totalAmount > 0 && (
            <>
              <div className="-mx-6 mt-5 overflow-auto flex-1">
                {items.map((item) => (
                  <div key={item.id} className="mb-2">
                    <CartDrawerItem
                      id={item.id}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      details={getCartItemDetails(
                        item.pizzaSize as PizzaSize,
                        item.type as PizzaType,
                        item.ingredients,
                      )}
                      price={item.price}
                      quantity={item.quantity}
                      disabled={item.disabled}
                      onClickCountButton={(type) =>
                        onClickCountButton(item.id, item.quantity, type)
                      }
                      onClickRemove={() => removeCartItem(item.id)}
                    />
                  </div>
                ))}
              </div>
              <SheetFooter className="-mx-6 bg-white p-8">
                <div className="w-full">
                  <div className="flex mb-4">
                    <span className="flex flex-1 text-lg text-neutral-500">
                      Total
                      <div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
                    </span>
                    <span className="font-bold text-lg">£{totalAmount}</span>
                  </div>

                  <Link href="/checkout">
                    <Button
                      onClick={() => setRedirecting(true)}
                      type="submit"
                      loading={redirecting}
                      className="w-full h-12 text-base"
                    >
                      Place Order <ArrowRight className="w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
