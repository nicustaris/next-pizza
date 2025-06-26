import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { loginFormSchema, TLoginFormValues } from "./schemas";
import { Button, Input } from "@/shared/components/ui";
import { Title } from "../../../title";
import { FormInput } from "../../../form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface Props {
  onClose?: VoidFunction;
}

const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginFormValues) => {
    try {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw new Error("Login failed");
      }

      toast.success("Login successfully", {
        icon: "✅",
      });

      onClose?.();
    } catch (error) {
      console.log("Error [LOGIN]", error);
      toast.error("Could not sign in", {
        icon: "❌",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title
              text="Sign in to your account"
              size="md"
              className="font-bold"
            />
            <p className="text-gray-400">Please enter your email address</p>
          </div>
          <img
            src="/assets/images/phone-icon.png"
            alt="phone-icon"
            width={60}
            height={60}
          />
        </div>

        <FormInput name="email" label="Email" required />
        <FormInput name="password" label="Password" type="password" required />

        <Button loading={form.formState.isSubmitting} type="submit">
          Sign in
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
