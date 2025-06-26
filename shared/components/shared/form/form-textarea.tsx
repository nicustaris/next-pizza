import React from "react";
import { RequiredSymbol } from "../required-symbol";
import { Textarea } from "../../ui";
import { ErrorText } from "../error-text";
import { ClearButton } from "../clear-button";
import { useFormContext } from "react-hook-form";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const FormTextarea: React.FC<Props> = ({
  name,
  label,
  required,
  className,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  return (
    <div className={className}>
      <p className="font-medium mb-2">
        {label && (
          <label>
            {label} {required && <RequiredSymbol />}
          </label>
        )}
      </p>
      <div className="flex relative">
        <Textarea className="h-10 text-md" {...register(name)} {...props} />

        {value && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
