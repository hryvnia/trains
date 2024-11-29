"use client";

import Image from "next/image";
import Chat from "./Chat";
import { useForm } from "react-hook-form";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { apiClient } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export interface Post {
  id: number;
  title: string;
  content: string;
}

export const fetchPosts = async () => {
  const { data } = await apiClient.get<Post[]>("/api/posts");
  return data;
};

export default function Home() {
  const { data: session } = useSession();

  const {
    data: posts,
    error,
    isLoading,
  } = useQuery<Post[], any>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div>
      <Container>
        {/* <Group mt="md">
          <ActionIcon
            onClick={async () => {
              console.log("session > ", session);

              try {
                const res = await apiClient.get("/api/auth/protected");
              } catch (err) {}
            }}
          >
            test
          </ActionIcon>
        </Group> */}

        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <SimpleGrid cols={4}>
            {posts?.map((post) => (
              <Card key={post.id} shadow="md" radius="md">
                <Title order={3}>{post.title}</Title>
                <Text>{post.content}</Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </div>
  );
}
