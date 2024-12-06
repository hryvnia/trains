"use client";

import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "./ThemeProvider";

import StoreProvider from "./StoreProvider";

export const Providers: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <StoreProvider>
      <SessionProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SessionProvider>
    </StoreProvider>
  );
};
