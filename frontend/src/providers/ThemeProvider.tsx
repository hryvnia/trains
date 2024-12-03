import { MantineProvider, createTheme } from "@mantine/core";

import { FC, ReactNode } from "react";
import "dayjs/locale/uk";
import { DatesProvider } from "@mantine/dates";

const theme = createTheme({});

export const ThemeProvider: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider settings={{ locale: "uk", timezone: "Europe/Kyiv" }}>
        {children}
        {/* <Notifications position="bottom-center" containerWidth={410} /> */}
      </DatesProvider>
    </MantineProvider>
  );
};
