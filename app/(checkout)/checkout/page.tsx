"use client";

import React from "react";

import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Container, Title } from "@/shared/components";
import { CheckoutSidebar } from "@/shared/components";

import {
  CheckoutCart,
  CheckoutDeliveryForm,
  CheckoutPersonalForm,
} from "@/shared/components";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";
import { useCart } from "@/shared/hooks";
import { createOrder } from "@/app/api/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const { updateItemQuantity, items, totalAmount, removeCartItem, loading } =
    useCart();

  const router = useRouter();

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "minus" | "plus",
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<CheckoutFormValues> = async (data) => {
    try {
      setSubmitting(true);
      const orderId = await createOrder(data);

      if (orderId) {
        router.push(`/checkout/${orderId}`);
      }

      toast.success("The order has been successfully placed", {
        icon: "👌",
      });
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      toast.error("The order could not be completed.", {
        icon: "❌",
      });
    }
  };

  return (
    <Container className="mt-10">
      <Title text="Checkout form" size="lg" className="font-extrabold mb-8" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                items={items}
                loading={loading}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
              />

              <CheckoutPersonalForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />

              <CheckoutDeliveryForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />
            </div>

            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
