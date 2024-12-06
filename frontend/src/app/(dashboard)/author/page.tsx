import { authorImage } from "@/assets";
import { Box, Group, Image, Stack, Text, Title } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Box>
        <Stack>
          <Group>
            <Title order={2}>Розробник</Title>
          </Group>
          <Group>
            <Image maw={320} w={"100%"} src={authorImage.src} radius="md" />
            <Stack gap={0}>
              <Text fw="600" size="lg">
                студент Григоренко Володимир
              </Text>
              <Text fw="600" c="dimmed">
                група 6.04.122.010.22.1
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Box>
    </>
  );
}
