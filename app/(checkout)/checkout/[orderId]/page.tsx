import React from "react";

import { prisma } from "@/prisma/prisma-client";
import { CheckoutPayment } from "@/shared/components/shared/checkout-payment";
import { Stripe } from "stripe";

import { notFound } from "next/navigation";
import { OrderStatus } from "@prisma/client";

interface Props {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function PaymentPage({ params }: Props) {
  const { orderId } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id: Number(orderId),
    },
    select: {
      totalAmount: true,
      status: true,
    },
  });

  if (!order) {
    return notFound();
  }

  if (order.status !== OrderStatus.PENDING) {
    return notFound();
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalAmount * 100,
    currency: "GBP",
    metadata: {
      order_id: 1,
    },
  });

  if (!paymentIntent.client_secret) {
    throw new Error("Stripe failed to create payment intent!");
  }

  return (
    <CheckoutPayment
      orderId={orderId}
      clientSecret={paymentIntent.client_secret}
      totalAmount={order.totalAmount}
    />
  );
}
