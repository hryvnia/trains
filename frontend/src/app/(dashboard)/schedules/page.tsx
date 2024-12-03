"use client";
import { api } from "@/lib";
import { Schedule } from "@/types";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { BarChart } from "@mantine/charts";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  // const { data: stations } = api.useGetStationsQuery({});
  // const { data: trains } = api.useGetTrainsQuery({});
  const { data: schedules } = api.useGetSchedulesQuery({});

  const [deleteSchedule, deleteScheduleRes] = api.useDeleteScheduleMutation();

  return (
    <>
      <Container maw="unset">
        <Stack>
          <Group>
            <Title order={2}>Рокзлад</Title>

            <ActionIcon
              variant="gradient"
              size="lg"
              onClick={() => router.push(`/schedules/create`)}
            >
              <IconPlus />
            </ActionIcon>
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Потяг</Table.Th>
                <Table.Th>Сполучення</Table.Th>
                <Table.Th>Час прибуття</Table.Th>
                <Table.Th>Затримка</Table.Th>
                <Table.Th>Колія</Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {schedules?.map((schedule, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{schedule.train?.number}</Table.Td>
                  <Table.Td>{schedule.train?.route}</Table.Td>
                  <Table.Td>
                    {dayjs(schedule.arrivalTime).format("DD.MM.YYYY HH:mm")}
                  </Table.Td>
                  <Table.Td>{schedule.delay_minutes.toString()}</Table.Td>
                  <Table.Td>{schedule.platform}</Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="end">
                      <ActionIcon
                        //color="yellow"
                        variant="gradient"
                        size="lg"
                        onClick={() => router.push(`/schedules/${schedule.id}`)}
                      >
                        <IconPencil />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        size="lg"
                        onClick={() => deleteSchedule(schedule.id)}
                        loading={
                          deleteScheduleRes.isLoading &&
                          deleteScheduleRes.originalArgs === schedule.id
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
        </Stack>
      </Container>
    </>
  );
}
