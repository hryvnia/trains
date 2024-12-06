"use client";

import { Box, Container, Text, Title } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const session = useSession();

  const user = session.data?.user;
  return (
    <Container maw="unset">
      {user && (
        <Box py="md">
          <Title order={2}>Ласкаво просимо, {user.username}</Title>
          <Text>{user.email}</Text>
          <Text mt="md" c="blue" td="underline">
            <Link href="/reports">Ваші звіти</Link>
          </Text>
        </Box>
      )}
    </Container>
  );
}
