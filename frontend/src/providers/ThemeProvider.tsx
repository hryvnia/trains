import { MantineProvider, createTheme } from "@mantine/core";

import { FC, ReactNode } from "react";

const theme = createTheme({});

export const ThemeProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
      {/* <Notifications position="bottom-center" containerWidth={410} /> */}
    </MantineProvider>
  );
};
