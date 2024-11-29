"use client";

import { useForm } from "react-hook-form";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { apiClient } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { CreateModal } from "./components";
import { Train } from "@/types";
import { useRouter } from "next/navigation";

export const fetchTrains = async () => {
  const { data } = await apiClient.get<Train[]>("/api/trains");
  return data;
};

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    data: trains,
    error,
    isLoading,
  } = useQuery<Train[], any>({
    queryKey: ["trains"],
    queryFn: fetchTrains,
    staleTime: 5 * 60 * 1000,
  });

  const [createOpened, setCreateOpened] = useState(false);

  return (
    <div>
      <Button onClick={() => setCreateOpened(true)}>create</Button>

      <CreateModal
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
      />

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
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>id</Table.Th>
                <Table.Th>number</Table.Th>
                <Table.Th>route</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {trains?.map((train) => (
                <Table.Tr key={train.id}>
                  <Table.Td>{train.id}</Table.Td>
                  <Table.Td>{train.number}</Table.Td>
                  <Table.Td>{train.route}</Table.Td>

                  <Table.Td>
                    <Button onClick={() => router.push(`/trains/${train.id}`)}>
                      edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Container>
    </div>
  );
}
