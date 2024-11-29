"use client";

import { Button, Container, Stack } from "@mantine/core";
import { useState } from "react";
import { RegisterForm } from "./Register";
import { LoginForm } from "./Login";

export default function Home() {
  const [register, setRegister] = useState(true);

  return (
    <div>
      <Container>
        {register ? (
          <Stack maw={400} mx="auto">
            <RegisterForm />
            <Button variant="transparent" onClick={() => setRegister(false)}>
              already have account?
            </Button>
          </Stack>
        ) : (
          <Stack maw={400} mx="auto">
            <LoginForm />
            <Button variant="transparent" onClick={() => setRegister(true)}>
              don't have account?
            </Button>
          </Stack>
        )}
      </Container>
    </div>
  );
}
