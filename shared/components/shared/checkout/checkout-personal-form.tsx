"use client";

import React from "react";
import { WhiteBlock } from "../white-block";
import { FormInput } from "../form";

interface Props {
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Personal data" className={className}>
      <div className="grid grid-cols-2 gap-5">
        <FormInput
          name="firstName"
          placeholder="First name"
          className="text-base"
        />
        <FormInput
          name="lastName"
          placeholder="Last name"
          className="text-base"
        />
        <FormInput name="email" placeholder="Email" className="text-base" />
        <FormInput
          name="phone"
          placeholder="Phone number"
          className="text-base"
        />
      </div>
    </WhiteBlock>
  );
};
