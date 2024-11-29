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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateModal } from "./components";
import { Train } from "@/types";
import { useRouter } from "next/navigation";

export const fetchTrains = async () => {
  const { data } = await apiClient.get<Train[]>("/api/trains");
  return data;
};

const deleteTrain = async (train_id: Train["id"]) => {
  const { data } = await apiClient.delete<Train>(`/api/trains/${train_id}`);
  return data;
};

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const {
    data: trains,
    error,
    isLoading,
  } = useQuery<Train[], any>({
    queryKey: ["trains"],
    queryFn: fetchTrains,
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrain,
    onSuccess: (newTrain) => {
      queryClient.invalidateQueries({ queryKey: ["trains"] });
    },
    onError: (error) => {
      console.error("Ошибка при уд поезда:", error);
    },
  });

  const [createOpened, setCreateOpened] = useState(false);

  console.log(JSON.stringify(deleteMutation));
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
                    <Group justify="end">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/trains/${train.id}`)}
                      >
                        edit
                      </Button>
                      <Button
                        color="red"
                        size="sm"
                        onClick={() => deleteMutation.mutateAsync(train.id)}
                        loading={
                          deleteMutation.isPending &&
                          deleteMutation.variables === train.id
                        }
                      >
                        del
                      </Button>
                    </Group>
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
