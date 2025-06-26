import React from "react";
import { cn } from "@/shared/lib/utils";
import { Title } from "./title";
import { Button } from "../ui";

interface Props {
  imageUrl: string;
  name: string;
  price: number;
  loading: boolean;
  onSubmit: VoidFunction;
  className?: string;
}

/**
 * PRODUCT selection form
 */

export const ChooseProductForm: React.FC<Props> = ({
  imageUrl,
  name,
  price,
  loading,
  onSubmit,
  className,
}) => {
  return (
    <div className={cn("flex flex-1", className)}>
      <div className="w-full flex items-center justify-center flex-1 relative">
        <img
          src={imageUrl}
          className="relative left-2 top-2 transition-all duration-300 w-[350px] h-[350px]"
        />
      </div>

      <div className="w-[490px] bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <Button
          onClick={() => onSubmit()}
          className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10"
          loading={loading}
        >
          Add to basket £{price}
        </Button>
      </div>
    </div>
  );
};
