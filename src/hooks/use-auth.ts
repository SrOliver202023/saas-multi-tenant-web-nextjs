"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    data: session,
    user: session?.user as {
      userId: string;
      email: string;
      name: string;
      username: string;
      managerAccountId?: string;
      ownerAccountId?: string;
    },
    token: session?.credentials?.accessToken,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
