"use client";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/infra/services/core";
import { SignUpForm } from "./sign-up-form";
import { toaster } from "@/components/ui/toaster";
import { AxiosError } from "axios";
import { IHttpResponseError, IHttpResponseSuccess } from "@/backend/core/types";
import { IAuthServiceRegisterData } from "@/core/services/core";
import { signIn } from "next-auth/react";
import { IAuthRegisterDto } from "@/backend/domain/dtos";

export function SignUpView() {
  const authService = new AuthService();

  const mutation = useMutation({
    mutationFn: async (data: IAuthRegisterDto) => {
      console.log("🟢 [SignUpView] Tentando registrar:", data);

      const registered = await authService.register(data);
      console.log("📦 [SignUpView] Resposta do register:", registered);

      if (registered.success) {
        console.log("✅ [SignUpView] Registro bem-sucedido, chamando signIn...");
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        console.log("📥 [SignUpView] Resultado do signIn:", result);

        if (result?.error) {
          console.error("❌ [SignUpView] Erro no signIn:", result.error);
        } else {
          console.log("✅ [SignUpView] Login bem-sucedido!");
        }
      } else {
        console.warn("⚠️ [SignUpView] Registro falhou:", registered.message);
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

  return <SignUpForm onSubmit={mutation.mutateAsync} isLoading={mutation.isPending} />;
}
