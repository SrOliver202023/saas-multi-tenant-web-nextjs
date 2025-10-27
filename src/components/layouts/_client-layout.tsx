"use client";

import "../../app/globals.css";
import { Provider } from "../ui/provider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Provider enableSystem defaultTheme="light">
      {children}
    </Provider>
  );
}
