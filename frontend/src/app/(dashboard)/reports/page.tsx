"use client";

import {
  ActionIcon,
  Box,
  Center,
  Container,
  Group,
  Loader,
  Table,
} from "@mantine/core";

import { api, apiClient } from "@/lib";
import dayjs from "dayjs";
import { IconDownload, IconTrash } from "@tabler/icons-react";

export default function Home({
  searchParams,
}: {
  searchParams: { all?: string };
}) {
  const { all } = searchParams;

  console.log("params > ", searchParams);
  const { data: reports, isFetching } = api.useGetReportsQuery({
    all: all === "true",
  });
  const [deleteReport, deleteReportRes] = api.useDeleteReportMutation();

  return (
    <Box mih="100vh">
      <Container>
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
                              })
                              .catch(() => {});
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
