"use client";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/infra/services/core";
import { SignUpForm } from "./sign-up-form";
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";
import { IHttpResponseError, IHttpResponseSuccess } from "@/backend/core/types";
import { IAuthServiceRegisterData } from "@/core/services/core";
import { signIn } from "next-auth/react";
import { IAuthSignUpDto } from "@/backend/domain/dtos";

export function SignUpView() {
  const authService = new AuthService();

  const mutation = useMutation({
    mutationFn: async (data: IAuthSignUpDto) => {
      const registered = await authService.register(data);

      if (registered.success) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
      }

      return registered;
    },

    onSuccess: (success: IHttpResponseSuccess<IAuthServiceRegisterData>) => {
      // setAuthCookies(success.data.credentials.accessToken, success.data.credentials.refreshToken, success.data.credentials.expiresIn);
      toaster.create({
        description: success.message,
        title: "Create account",
        type: "success",
      });
    },
    onError: (error: AxiosError<IHttpResponseError<undefined>>) => {
      toaster.create({
        description: error.response?.data?.message,
        title: "Create account",
        type: "error",
      });
    },
  });

  function handleGoogleSignUp() {
    signIn("google", {
      redirect: true,
      state: "mode=signUp", // 👈 adiciona o modo aqui
    });
  }

  return <SignUpForm onSubmit={mutation.mutateAsync} isLoading={mutation.isPending} onGoogleSignUp={handleGoogleSignUp} />;
}
