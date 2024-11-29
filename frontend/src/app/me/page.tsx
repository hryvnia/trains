"use client";

import { apiClient } from "@/lib";
import { Button, Container, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";

export default function Page() {
  const { register, formState, handleSubmit } = useForm<{
    title: string;
    content: string;
  }>();
  return (
    <Container>
      <form
        onSubmit={handleSubmit((data) => {
          apiClient.post("/api/posts", data);
        })}
      >
        <Stack>
          <TextInput label="Title" {...register("title")} />
          <Textarea label="Content" {...register("content")} />
          <Button type="submit">create</Button>
        </Stack>
      </form>
    </Container>
  );
}
