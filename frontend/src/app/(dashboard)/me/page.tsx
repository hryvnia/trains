"use client";

import { apiClient } from "@/lib";
import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function Page() {
  const { register, formState, handleSubmit } = useForm<{
    title: string;
    content: string;
  }>();
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

      {/* <form
        onSubmit={handleSubmit((data) => {
          apiClient.post("/api/posts", data);
        })}
      >
        <Stack>
          <TextInput label="Title" {...register("title")} />
          <Textarea label="Content" {...register("content")} />
          <Button type="submit">create</Button>
        </Stack>
      </form> */}
    </Container>
  );
}
