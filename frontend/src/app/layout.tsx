import { Montserrat } from "next/font/google";
import { ColorSchemeScript, Flex } from "@mantine/core";
import { Providers } from "@/providers";

import type { Metadata } from "next";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "dayjs/locale/uk";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Рух пасажирських поїздів по станції Харків",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={montserrat.className}>
        <Providers>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
