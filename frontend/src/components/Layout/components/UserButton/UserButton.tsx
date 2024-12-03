import { IconChevronRight } from "@tabler/icons-react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function UserButton() {
  const session = useSession();

  const router = useRouter();

  if (!session.data) {
    return null;
  }
  return (
    <UnstyledButton className={classes.user} onClick={() => router.push("/me")}>
      <Group wrap="nowrap">
        <Avatar
          //src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
        />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {session.data.user.username}
          </Text>

          <Text
            c="dimmed"
            size="xs"
            lineClamp={1}
            style={{ wordBreak: "break-all" }}
          >
            {session.data.user.email}
          </Text>
        </div>

        <IconChevronRight style={{ flexShrink: 0 }} size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
