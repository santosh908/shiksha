'use client';

import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Flex,
  Group,
  Indicator,
  MantineTheme,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBell,
  IconCircleHalf2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { upperFirst, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import LogoutButton from '@/Components/atom/Button/LogoutButton';
import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Message } from './Message.types';
// import LogoutButton from '@/Components/atom/Button/LogoutButton';
//
const ICON_SIZE = 20;

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Notification',
    message: 'This feture coming soon',
    icon: '',
  },
  {
    id: '1',
    title: 'Notification',
    message: 'This feture coming soon',
    icon: '',
  },
];

type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  desktopOpened?: boolean;
  toggleDesktop?: () => void;
  messages?: Message[];
};

const HeaderNav = (props: HeaderNavProps) => {
  const { desktopOpened, toggleDesktop, toggleMobile, mobileOpened } = props;
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const laptop_match = useMediaQuery('(max-width: 992px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const pageMessages = usePage<{ messages?: Message[] }>().props.messages || [];
  const allMessages = [...(props.messages || []), ...pageMessages];

  const messageItems = allMessages.map((m) => (
    <Menu.Item
      key={m.id}
      component={Link}
      href={route('SuperAdmin.message')}
      style={{
        borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]}`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar src={null} alt={m.name} variant="filled" size="sm" color={theme.colors[theme.primaryColor][7]}>
          {m.name.charAt(0)}
        </Avatar>
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {m.name} | {m.from_id} | {m.devotee_type}
          </Text>
          <Text fz="sm" fw={600}>
            {m.subject}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

  const notifications = NOTIFICATIONS.slice(0, 3).map((n) => (
    <Menu.Item
      key={n.id}
      style={{
        borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[3]}`,
      }}
    >
      <Flex gap="sm" align="center">
        <Avatar src={n.icon} alt={n.title} variant="filled" size="sm" />
        <Stack gap={1}>
          <Text fz="sm" fw={600}>
            {n.title}
          </Text>
          <Text lineClamp={2} fz="xs" c="dimmed">
            {n.message}
          </Text>
        </Stack>
      </Flex>
    </Menu.Item>
  ));

  const handleColorSwitch = (mode: 'light' | 'dark' | 'auto') => {
    setColorScheme(mode);
    showNotification({
      title: `${upperFirst(mode)} is on`,
      message: `You just switched to ${colorScheme === 'dark' ? 'light' : 'dark'} mode. Hope you like it`,
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor: colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2],
          borderColor: colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2],

          '&::before': {
            backgroundColor: colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[7],
          },
        },

        title: {
          color: colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[7],
        },
        description: {
          color: colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[7],
        },
        closeButton: {
          color: colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[7],
          '&:hover': {
            backgroundColor: theme.colors.red[5],
            color: theme.white,
          },
        },
      }),
    });
  };

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Tooltip label="Toggle side navigation">
          <ActionIcon visibleFrom="md" onClick={toggleDesktop}>
            {desktopOpened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftExpand />}
          </ActionIcon>
        </Tooltip>
        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="md" size="sm" />
        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="md" size="sm" />
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon>
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
        )}

        <Menu shadow="lg" width={320}>
          <Menu.Target>
            {/* <Indicator processing={allMessages.some((m) => !m.is_viewed)} size={10} offset={6} color={theme.colors.red[6]}> */}
            <Tooltip label="Messages">
              <ActionIcon size="lg" title="Messages" color={theme.colors.blue[6]}>
                <IconMessageCircle size={ICON_SIZE} />
                {allMessages.length}
              </ActionIcon>
            </Tooltip>
            {/* </Indicator> */}
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              {allMessages.length} new messages
            </Menu.Label>
            {messageItems}
            <Menu.Item tt="uppercase" ta="center" fw={600} component={Link} href={route('SuperAdmin.message')}>
              Show all messages
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Tooltip label="Logout">
          <Box>
            <LogoutButton />
          </Box>
        </Tooltip>

        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Switch color modes">
              <ActionIcon variant="light">
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} />
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select color modes
            </Menu.Label>
            <Menu.Item leftSection={<IconSunHigh size={16} />} onClick={() => setColorScheme('light')}>
              Light
            </Menu.Item>
            <Menu.Item leftSection={<IconMoonStars size={16} />} onClick={() => setColorScheme('dark')}>
              Dark
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
