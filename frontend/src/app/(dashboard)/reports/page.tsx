"use client";

import Image from "next/image";

import { useForm } from "react-hook-form";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Table,
} from "@mantine/core";

import { signIn, signOut, useSession } from "next-auth/react";
import { api, apiClient } from "@/lib";
import dayjs from "dayjs";
import { IconDownload, IconTrash } from "@tabler/icons-react";
import { useParams, useSearchParams } from "next/navigation";

export default function Home() {
  //   const { data, isFetching } = api.useGetSchedulesStatsQuery({
  //     date: "2024-12-02",
  //   });

  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const { data: reports, isFetching } = api.useGetReportsQuery({
    all: Boolean(searchParams.get("all")),
  });
  const [deleteReport, deleteReportRes] = api.useDeleteReportMutation();

  return (
    <Box mih="100vh">
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

        {isFetching ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ID</Table.Th>
                  <Table.Th>Створений</Table.Th>
                  <Table.Th>Від</Table.Th>
                  <Table.Th>До</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reports?.map((report) => (
                  <Table.Tr key={report.id}>
                    <Table.Td>{report.id}</Table.Td>
                    <Table.Td>{report.user.username}</Table.Td>
                    <Table.Td>
                      {dayjs(report.startDate).format("DD.MM.YYYY")}
                    </Table.Td>
                    <Table.Td>
                      {dayjs(report.endDate).format("DD.MM.YYYY")}
                    </Table.Td>

                    <Table.Td>
                      <Group gap="xs" justify="end">
                        <ActionIcon
                          color="green"
                          size="lg"
                          onClick={() => {
                            apiClient
                              .get(`/api/reports/${report.id}/export`, {
                                responseType: "blob",
                              })
                              .then((response) => {
                                const url = window.URL.createObjectURL(
                                  new Blob([response.data])
                                );
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `report_${report.id}.csv`
                                );
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode?.removeChild(link);
                              });
                          }}
                        >
                          <IconDownload />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          size="lg"
                          onClick={() => deleteReport(report.id)}
                          loading={
                            deleteReportRes.isLoading &&
                            deleteReportRes.originalArgs === report.id
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
          </>
        )}
      </Container>
    </Box>
  );
}
