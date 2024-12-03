"use client";

import { Box, Button, Center, Container, Flex, Stack } from "@mantine/core";
import { useState } from "react";
import { RegisterForm } from "./Register";
import { LoginForm } from "./Login";

export default function Home() {
  const [register, setRegister] = useState(false);

  return (
    <Stack flex={1} justify="center">
      <Container h="100%" w="100%" size="xs">
        {register ? (
          <Stack gap="xs" w="100%">
            <RegisterForm />
            <Button variant="transparent" onClick={() => setRegister(false)}>
              У вас вже є акаунт?
            </Button>
          </Stack>
        ) : (
          <Stack gap="xs" w="100%">
            <LoginForm />
            <Button variant="subtle" onClick={() => setRegister(true)}>
              Немає акаунту?
            </Button>
          </Stack>
        )}
      </Container>
    </Stack>
  );
}
