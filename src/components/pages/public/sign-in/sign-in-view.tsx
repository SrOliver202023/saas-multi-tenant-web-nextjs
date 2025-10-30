"use client";
import { useMutation } from "@tanstack/react-query";
import { SignInForm } from "./sign-in-form";
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";
import { IHttpResponseError } from "@/backend/core/types";
import { IAuthSignInDto } from "@/backend/domain/dtos";

import { signIn } from "next-auth/react";
export function SignInView() {
  const mutation = useMutation({
    mutationFn: async (data: IAuthSignInDto) => {
      await signIn("credentials", {
        email: data.identifier,
        password: data.password,
        redirect: true,
        callbackUrl: "/home",
      });
    },

    onSuccess: () => {
      toaster.create({
        description: "Login with success",
        title: "Login",
        type: "success",
      });
    },
    onError: (error: AxiosError<IHttpResponseError<undefined>>) => {
      toaster.create({
        description: error.response?.data?.message,
        title: "Login",
        type: "error",
      });
    },
  });

  return <SignInForm onSubmit={mutation.mutateAsync} isLoading={mutation.isPending} />;
}
