import GuestNonLandingLayout from '@/Layouts/guest/GuestNonLandingLayout';
import { Anchor, Box, Card, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { Link, usePage } from '@inertiajs/react';

const DEFAULT_MESSAGE =
  'Your registration request has been submitted successfully. Once your profile is approved, you will be notified by email.';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text size="xs" fw={700} tt="uppercase" c="dimmed" lts={0.5}>
      {children}
    </Text>
  );
}

export default function RegistrationSubmitted() {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const message = flash?.success ?? DEFAULT_MESSAGE;

  return (
    <GuestNonLandingLayout pageTitle="Registration submitted">
      <Box w="100%" maw={520} mx="auto" px={{ base: 'xs', sm: 0 }} py={{ base: 'md', sm: 'xl' }}>
        <Card
          shadow="md"
          radius="lg"
          padding={{ base: 'lg', sm: 'xl' }}
          withBorder
        >
          <Stack gap="lg" align="center" ta="center">
            <ThemeIcon size={64} radius="xl" variant="light" color="teal" aria-hidden>
              <IconCircleCheck size={34} stroke={1.5} />
            </ThemeIcon>
            <Box>
              <Title order={2} size="h3" mb="xs">
                Registration received
              </Title>
              <SectionTitle>What happens next</SectionTitle>
            </Box>
            <Text size="md" c="dark.7" lh={1.6} maw={420}>
              {message}
            </Text>
            <Text size="sm" c="dimmed" mt="xs">
              Please keep your login details safe. You can sign in after your profile is approved.
            </Text>
            <Anchor component={Link} href="/login" size="md" fw={600} mt="sm">
              Continue to login
            </Anchor>
          </Stack>
        </Card>
      </Box>
    </GuestNonLandingLayout>
  );
}
