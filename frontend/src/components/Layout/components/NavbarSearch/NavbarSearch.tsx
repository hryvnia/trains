import {
  IconBulb,
  IconCalendar,
  IconCalendarClock,
  IconCheckbox,
  IconHome,
  IconLogout,
  IconMan,
  IconPacman,
  IconPlus,
  IconReportAnalytics,
  IconSearch,
  IconTrack,
  IconTrain,
  IconUser,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Box,
  Code,
  Group,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { UserButton } from "../UserButton/UserButton";
import classes from "./NavbarSearch.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const links = [
  {
    icon: IconReportAnalytics,
    label: "Огляд",
    //notifications: 3,
    href: "/",
  },
  // { icon: IconTrack, label: "Станції", notifications: 1 },
  { icon: IconTrain, label: "Потяги", href: "/trains" },
  {
    icon: IconCalendarClock,
    label: "Розклад",
    //notifications: 4,
    href: "/schedules",
  },
  {
    icon: IconPacman,
    label: "Розробник",
    //notifications: 4,
    href: "/author",
  },
];

const collections = [
  // { emoji: "🚚", label: "Deliveries" },
  // { emoji: "💸", label: "Discounts" },
  // { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Усі ", href: "/reports?all=true" },
  { emoji: "💁‍♀️", label: "Мої звіти", href: "/reports" },
  // { emoji: "", label: "Customers" },
  // { emoji: "🛒", label: "Orders" },
  // { emoji: "📅", label: "Events" },
  // { emoji: "🙈", label: "Debts" },
];

export function NavbarSearch() {
  const router = useRouter();

  const mainLinks = links.map((link) => (
    <Link
      key={link.label}
      className={classes.mainLink}
      href={link.href}
      //onClick={() => router.push(link.href)}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </Link>
  ));

  const collectionLinks = collections.map((collection) => (
    <Link
      href={collection.href}
      key={collection.label}
      className={classes.collectionLink}
    >
      <Box component="span" mr={9} fz={16}>
        {collection.emoji}
      </Box>{" "}
      {collection.label}
    </Link>
  ));

  return (
    <>
      <div className={classes.section}>
        <UserButton />
      </div>

      <TextInput
        placeholder="Пошук"
        size="xs"
        leftSection={<IconSearch size={12} stroke={1.5} />}
        //rightSectionWidth={70}
        //rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      />

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Звіти
          </Text>
          <Tooltip label="Згенерувати звіт" withArrow position="right">
            <ActionIcon
              variant="default"
              size={18}
              onClick={() => router.push("/reports/generate")}
            >
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </div>

      <div className={classes.section} style={{ marginTop: "auto" }}>
        <div className={classes.mainLinks}>
          <UnstyledButton
            className={classes.mainLink}
            onClick={() => signOut()}
          >
            <div className={classes.mainLinkInner}>
              <IconLogout
                size={20}
                className={classes.mainLinkIcon}
                stroke={1.5}
              />
              <span>Вийти</span>
            </div>
          </UnstyledButton>
        </div>
      </div>
    </>
  );
}
