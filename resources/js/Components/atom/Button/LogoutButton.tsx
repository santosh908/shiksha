import { router } from '@inertiajs/react';
import { ActionIcon } from '@mantine/core';
import { IconPower } from '@tabler/icons-react';

const LogoutButton = () => {
  return (
    <ActionIcon onClick={() => router.get('/logout')}>
      <IconPower size={24} />
    </ActionIcon>
  );
};

export default LogoutButton;
