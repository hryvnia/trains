"use client";

import { AppShell, Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC, ReactNode } from "react";

export const Layout: FC<{ children?: ReactNode }> = ({ children }) => {
  const session = useSession();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Link href={"/"}>Main</Link>

          {session.data?.user ? (
            <Group>
              <Avatar component={Link} href="/me" />
              <Stack align="start" gap={0}>
                <Text span size="sm" fw={600}>
                  {session.data.user.username}
                </Text>
                <Button
                  size="compact-xs"
                  variant="transparent"
                  p={0}
                  h={16}
                  onClick={() => signOut()}
                >
                  log out
                </Button>
              </Stack>
            </Group>
          ) : (
            <Group>
              <Button component={Link} href="/auth">
                Auth
              </Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
