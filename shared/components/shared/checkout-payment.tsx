"use client";

import React, { FormEvent } from "react";

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "../ui";

interface Props {
  orderId: string;
  totalAmount: number;
  clientSecret: string;
}

export const CheckoutPayment: React.FC<Props> = ({
  orderId,
  totalAmount,
  clientSecret,
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string,
  );

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <Form orderId={orderId} totalAmount={totalAmount} />
    </Elements>
  );
};

function Form({
  orderId,
  totalAmount,
}: {
  orderId: string;
  totalAmount: number;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (stripe == null || elements == null) return;
    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?paid`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(error.message);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="flex flex-col space-y-2 my-4">
        <p className="font-lg">
          Order: <span className="font-semibold">{orderId}</span>
        </p>
        <span className="font-semibold text-md">
          Order summary: £{totalAmount}
        </span>
      </div>
      {errorMessage && <p className="text-destructive my-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <div className="mt-4">
          <LinkAuthenticationElement />
        </div>

        <Button loading={isLoading} className="mt-4 text-md">
          Pay for the order
        </Button>
      </form>
    </>
  );
}
