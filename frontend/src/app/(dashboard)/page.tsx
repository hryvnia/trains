"use client";

import {
  ActionIcon,
  Box,
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
import { api, apiClient } from "@/lib";
import { useQuery } from "@tanstack/react-query";
import { BarChart } from "@mantine/charts";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";

export default function Home() {
  const [date, setDate] = useState<Date>(dayjs("2024-12-02").toDate());

  const { data, isFetching } = api.useGetSchedulesStatsQuery({
    date: dayjs(date).format("YYYY-MM-DD"),
  });

  return (
    <Box mih="100vh">
      <Container maw="unset">
        {isFetching ? (
          <Center p="md">
            <Loader />
          </Center>
        ) : (
          <Stack>
            <Group>
              <Title order={2}>Огляд</Title>

              <DatePickerInput
                w={210}
                ml="auto"
                value={date}
                onChange={(value) => setDate(dayjs(value).toDate())}
              />
            </Group>
            <BarChart
              h={300}
              data={
                data?.map((i) => {
                  return {
                    ...i,
                    arrivals: i.arrivals.length,
                    departures: i.departures.length,
                  };
                }) || []
              }
              dataKey="hour"
              withLegend
              legendProps={{ verticalAlign: "bottom", height: 50 }}
              series={[
                { name: "arrivals", color: "teal.6", label: "Прибуття" },
                { name: "departures", color: "blue.6", label: "Відправлення" },
                // { name: "Tablets", color: "teal.6" },
              ]}
              xAxisLabel="Година"
              yAxisLabel="Кількість"
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}

// <SimpleGrid cols={4}>
//   {posts?.map((post) => (
//     <Card key={post.id} shadow="md" radius="md">
//       <Title order={3}>{post.title}</Title>
//       <Text>{post.content}</Text>
//     </Card>
//   ))}
// </SimpleGrid>
