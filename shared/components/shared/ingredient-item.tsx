import React from "react";
import { cn } from "@/shared/lib/utils";
import { CircleCheck } from "lucide-react";

interface Props {
  name: string;
  imageUrl: string;
  price: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const IngredientItem: React.FC<Props> = ({
  name,
  imageUrl,
  price,
  active,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-md w-32 text-center relative cursor-pointer shadow-md bg-white p-2",
        { "border border-primary": active },
        className,
      )}
      onClick={onClick}
    >
      {active && (
        <CircleCheck className="absolute top-2 right-2 text-primary" />
      )}
      <img src={imageUrl} width={110} height={110} className="flex-shrink-0" />

      <div className="flex flex-1 items-center justify-center">
        <span className="text-xs text-center">{name}</span>
      </div>

      <span className="font-bold">£{price}</span>
    </div>
  );
};
export default IngredientItem;
