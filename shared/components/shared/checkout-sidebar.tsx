"use client";

import React from "react";
import { currencyFormatter } from "@/shared/lib/formatters";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { WhiteBlock } from "./white-block";
import { CheckoutItemDetails } from "./checkout-item-details";
import { Button, Skeleton } from "../ui";

const VAT = 20;
const DELIVERY_PRICE = 5;

interface Props {
  totalAmount: number;
  loading: boolean;
}

export const CheckoutSidebar: React.FC<Props> = ({ totalAmount, loading }) => {
  const vatPrice = (totalAmount * VAT) / 100;
  const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE;

  return (
    <WhiteBlock className="p-6 sticky top-4">
      <div className="flex flex-col gap-1">
        <span className="text-xl">Total:</span>
        {loading ? (
          <Skeleton className="w-32 h-8" />
        ) : (
          <span className="text-3xl h-8 font-extrabold">
            {totalAmount && currencyFormatter(totalPrice)}
          </span>
        )}
      </div>
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Package className="mr-2 text-gray-300" size={18} />
            Product prices
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-12 h-6" />
          ) : (
            currencyFormatter(totalAmount)
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Percent className="mr-2 text-gray-300" size={18} />
            TVA
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-12 h-6" />
          ) : (
            currencyFormatter(vatPrice)
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center">
            <Truck className="mr-2 text-gray-300" size={18} />
            Delivery fee
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-12 h-6" />
          ) : (
            currencyFormatter(DELIVERY_PRICE)
          )
        }
      />

      <Button
        type="submit"
        loading={loading}
        className="w-full h-14 rounded-2xl mt-12 text-base font-bold"
      >
        Proceed to payment
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
