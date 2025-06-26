"use client";

import React, { useEffect } from "react";
import { cn } from "@/shared/lib/utils";

import { Input } from "../ui";
import { useFormContext } from "react-hook-form";
import { ErrorText } from "./error-text";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
}

interface AddressSuggestion {
  address: string;
  id: string;
  url: string;
}

export const AddressInput: React.FC<Props> = ({
  name,
  className,
  ...props
}) => {
  const [suggestions, setSuggestions] = React.useState<AddressSuggestion[]>([]);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const skipFetchRef = React.useRef(false);
  const errorText = errors[name]?.message as string;

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      findAddress(value);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  //TODO: Make a reusable component
  const findAddress = async (postcode: string) => {
    try {
      const response = await fetch(
        `https://api.getAddress.io/autocomplete/${postcode}?api-key=UnT2DGayc0W4Ze2Z9UhjcA46501`,
      );
      const data = await response.json();
      setSuggestions(data.suggestions ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddressSelect = (item: AddressSuggestion) => {
    skipFetchRef.current = true;
    setValue(name, item.address);
    setSuggestions([]);
  };

  return (
    <div className={cn(className)}>
      <Input className="h-10 text-base" {...register(name)} {...props} />
      {suggestions.length > 0 && (
        <ul className="w-full h-[200px] overflow-auto mt-2 rounded-md bg-white shadow">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-3 py-1 cursor-pointer hover:bg-gray-50"
              onClick={() => handleAddressSelect(item)}
            >
              {item.address}
            </li>
          ))}
        </ul>
      )}
      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
