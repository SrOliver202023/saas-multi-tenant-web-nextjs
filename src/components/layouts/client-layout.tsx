"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../../app/globals.css";
import { Provider } from "../ui/provider";
import { Toaster } from "../ui/toaster";
import { SessionProvider } from "next-auth/react";
import { AuthenticatedLayout } from "./authenticated-layout";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Provider enableSystem defaultTheme="light">
          <Toaster />
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
