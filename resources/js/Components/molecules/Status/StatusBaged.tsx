// StatusBadge.tsx
import React, { useState } from 'react';
import { ActionIcon, Badge, Box, Card, Group, Popover, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface StatusBadgeProps {
  status?: string | null;
  StatusRemarks?: string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, StatusRemarks }) => {
  const [opened, setOpened] = useState(false);
  // Normalize status to a usable string (handles null/undefined)
  const s = (status ?? '').toString().trim();

  let color: string = 'gray';
  let label: string = 'Unknown';

  if (s === 'S') {
    color = 'yellow';
    label = 'Submitted';
  } else if (s === 'P' || s === '' || s==='N') {
    color = 'dark';
    label = 'Partially Submitted';
  } else if (s === 'A') {
    color = 'green';
    label = 'Approved';
  } 
  else if (s === 'D') {
    color = 'red';
    label = 'Deleted';
  }
  else if (s === 'R') {
    color = 'red';
    label = 'Rejected';
  }

  return (
    <>
      <Badge color={color}>{label}</Badge>
      {StatusRemarks && String(StatusRemarks).trim() !== '' && (
        <Popover opened={opened} onClose={() => setOpened(false)} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon
              color="orange"
              onClick={() => setOpened((o) => !o)}
              style={{ marginLeft: 8 }} // Adds spacing between badge and icon
            >
              <IconInfoCircle size={18} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown py={0} ml={0} mr={0}>
            <Box py={20}>
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Raised query by Ashray Leader</Text>
              </Group>
              <Text size="sm" c="dimmed">
                {StatusRemarks}
              </Text>
            </Box>
          </Popover.Dropdown>
        </Popover>
      )}
    </>
  );
};

export default StatusBadge;
