import { Card, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { usePage } from '@inertiajs/react';
import { PageHeader } from '@/Components/molecules/DashboardComponents';

type DevoteeProfileUser = {
  name?: string;
  email?: string;
  login_id?: string;
  contact_number?: string;
  Initiated_name?: string;
  devotee_type?: string;
  account_approved?: string;
};

function Profile() {
  const { user } = usePage<{ user?: DevoteeProfileUser }>().props;

  const rows = [
    { label: 'Name', value: user?.name || 'NA' },
    { label: 'Initiated Name', value: user?.Initiated_name || 'NA' },
    { label: 'Login ID', value: user?.login_id || 'NA' },
    { label: 'Email', value: user?.email || 'NA' },
    { label: 'Contact Number', value: user?.contact_number || 'NA' },
    { label: 'Role Type', value: user?.devotee_type || 'NA' },
    { label: 'Account Status', value: user?.account_approved === 'Y' ? 'Approved' : user?.account_approved || 'NA' },
  ];

  return (
    <Stack gap="lg" py={20}>
      <PageHeader title="My Profile" withActions={false} />

      <Grid>
        <Grid.Col span={{ base: 12, md: 12, lg: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Devotee Profile Details
            </Title>
            <Stack gap="xs">
              {rows.map((row) => (
                <Group key={row.label} justify="space-between">
                  <Text fw={600}>{row.label}</Text>
                  <Text>{row.value}</Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Profile;