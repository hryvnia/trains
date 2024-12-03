"use client";
import { api } from "@/lib";
import { Report } from "@/types";
import {
  Box,
  Button,
  Container,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function Page() {
  const router = useRouter();
  const { formState, handleSubmit, register, control } = useForm<Report>({});

  const [generateReport, generateReportRes] = api.useGenerateReportMutation();

  return (
    <>
      <Container>
        <Box
          component="form"
          onSubmit={handleSubmit(async (data) => {
            try {
              await generateReport(data);
              router.push("/reports");
            } catch (err) {}
          })}
        >
          <Stack>
            <SimpleGrid cols={2}>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePickerInput
                    label="Від"
                    {...field}
                    value={
                      field.value ? dayjs(field.value).toDate() : undefined
                    }
                  />
                )}
              />
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DatePickerInput
                    label="До"
                    {...field}
                    value={
                      field.value ? dayjs(field.value).toDate() : undefined
                    }
                  />
                )}
              />
            </SimpleGrid>
            <TextInput label="Назва звіту" {...register("name")} />
            <Button
              type="submit"
              variant="filled"
              loading={formState.isSubmitting}
            >
              Згенерувати
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}