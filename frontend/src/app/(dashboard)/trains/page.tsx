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
  Stack,
  Table,
  Title,
} from "@mantine/core";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { CreateModal } from "./components";

import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: trains, isLoading } = api.useGetTrainsQuery({});

  const [deleteTrain, deleteTrainRes] = api.useDeleteTrainMutation();

  const pathname = usePathname();

  const [createOpened, setCreateOpened] = useState(false);

  return (
    <div>
      <Container maw="unset">
        <Stack>
          <Group>
            <Title order={2}>Потяги</Title>

            <ActionIcon
              variant="gradient"
              size="lg"
              onClick={() => router.push(`/trains/create`)}
            >
              <IconPlus />
            </ActionIcon>
          </Group>

          {isLoading ? (
            <Center p="md">
              <Loader />
            </Center>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Номер</Table.Th>
                  <Table.Th>Сполучення</Table.Th>
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
                      <Group gap="xs" justify="end">
                        <ActionIcon
                          //color="yellow"
                          variant="gradient"
                          size="lg"
                          onClick={() => router.push(`/trains/${train.id}`)}
                        >
                          <IconPencil />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          size="lg"
                          onClick={() => deleteTrain(train.id)}
                          loading={
                            deleteTrainRes.isLoading &&
                            deleteTrainRes.originalArgs === train.id
                          }
                        >
                          <IconTrash />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Container>
    </div>
  );
}
