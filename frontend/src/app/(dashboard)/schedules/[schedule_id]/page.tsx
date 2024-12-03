"use client";
import { api } from "@/lib";
import { Schedule } from "@/types";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Controller, useForm } from "react-hook-form";

import dayjs from "dayjs";
import { useEffect } from "react";

import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { schedule_id: string } }) {
  const router = useRouter();
  const { schedule_id } = params;

  const creating = schedule_id === "create";

  const { data: stations } = api.useGetStationsQuery({});
  const { data: trains } = api.useGetTrainsQuery({});
  const { schedule } = api.useGetSchedulesQuery(
    {},
    {
      selectFromResult: (res) => ({
        ...res,
        schedule: res.data?.find((i) => i.id === schedule_id),
      }),
    }
  );

  const [createSchedule, createScheduleRes] = api.useCreateScheduleMutation();
  const [updateSchedule, updateScheduleRes] = api.useUpdateScheduleMutation();

  const { register, control, formState, handleSubmit, reset, getValues } =
    useForm<Schedule>({});

  useEffect(() => {
    if (schedule) {
      reset(schedule);
    }
  }, [schedule, reset]);

  return (
    <>
      <Container>
        <Stack>
          <Group>
            <ActionIcon
              variant="gradient"
              size="lg"
              onClick={() => router.push(`/schedules`)}
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={2}>{creating ? "Створення" : "Редагування"}</Title>
          </Group>
          <Box
            //
            component="form"
            onSubmit={handleSubmit(async (data) => {
              try {
                if (creating) {
                  await createSchedule(data).unwrap();
                } else {
                  await updateSchedule(data).unwrap();
                }
                router.push(`/schedules`);
              } catch (err) {}
            })}
          >
            <Stack>
              <SimpleGrid cols={2}>
                <Controller
                  control={control}
                  name="station_id"
                  render={({ field }) => (
                    <Select
                      label="Станція"
                      data={stations?.map((s) => ({
                        value: s.id,
                        label: s.name,
                      }))}
                      {...field}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="train_id"
                  render={({ field }) => (
                    <Select
                      label="Потяг"
                      data={trains?.map((train) => ({
                        value: train.id,
                        label: `${train.number} ${train.route}`,
                      }))}
                      {...field}
                    />
                  )}
                />
              </SimpleGrid>

              <Controller
                control={control}
                name="arrivalTime"
                render={({ field }) => (
                  <DateTimePicker
                    label="Час прибуття"
                    {...field}
                    value={
                      field.value ? dayjs(field.value).toDate() : undefined
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="departureTime"
                render={({ field }) => (
                  <DateTimePicker
                    label="Час відправлення"
                    {...field}
                    value={
                      field.value ? dayjs(field.value).toDate() : undefined
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="platform"
                render={({ field: { value, ...field } }) => (
                  <TextInput label="Колія" {...field} value={value || ""} />
                )}
              />

              <Controller
                control={control}
                name="delay_minutes"
                render={({ field }) => (
                  <NumberInput
                    label="Затримка"
                    {...field}
                    suffix=" хв"
                    min={0}
                  />
                )}
              />

              <Button
                type="submit"
                size="md"
                fullWidth
                loading={formState.isSubmitting}
              >
                {creating ? "Створити" : "Зберегти"}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
