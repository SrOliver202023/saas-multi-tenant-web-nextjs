"use client";
import { useMutation } from "@tanstack/react-query";
import { SignInForm } from "./sign-in-form";
import { toaster } from "@/components/ui/toaster";
import { IAuthSignInDto } from "@/backend/domain/dtos";
import { signIn } from "next-auth/react";

export function SignInView() {
  const mutation = useMutation({
    mutationFn: async (data: IAuthSignInDto) => {
      const result = await signIn("credentials", {
        email: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },

    onSuccess: () => {
      toaster.create({
        title: "Login",
        description: "Login efetuado com sucesso!",
        type: "success",
      });

      window.location.href = "/home";
    },

    onError: (error: Error) => {
      toaster.create({
        title: "Login",
        description: error.message || "Falha no login",
        type: "error",
      });
    },
  });

  return <SignInForm onSubmit={mutation.mutateAsync} isLoading={mutation.isPending} />;
}
