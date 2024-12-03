"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "./ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StoreProvider from "./StoreProvider";

const queryClient = new QueryClient();

export const Providers: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
};
