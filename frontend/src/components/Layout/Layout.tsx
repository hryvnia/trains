"use client";

import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { NavbarSearch } from "./components/NavbarSearch/NavbarSearch";
import { useDisclosure } from "@mantine/hooks";
import { IconMoon, IconSun, IconTrack, IconTrain } from "@tabler/icons-react";

import cx from "clsx";

import classes from "./Layout.module.sass";

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const session = useSession();

  const [opened, { toggle }] = useDisclosure();

  const { setColorScheme, clearColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group gap="xs">
            <IconTrack size={32} />
            <Title size="md">Kharkiv</Title>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar pt={0} p="md">
        <NavbarSearch />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
