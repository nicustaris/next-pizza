"use client";

import React from "react";
import { WhiteBlock } from "../white-block";
import { FormTextarea } from "../form";
import { AddressInput } from "../address-input";

interface Props {
  className?: string;
}

export const CheckoutDeliveryForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="3. Delivery address" className={className}>
      <div className="flex flex-col gap-5">
        <AddressInput name="address" placeholder="Post code" />

        <FormTextarea
          name="comment"
          rows={5}
          placeholder="Instructions"
          className="text-base"
        />
      </div>
    </WhiteBlock>
  );
};
