import ImageCarousel from '@/Components/molecules/ImageCarousel/ImageCarousel';
import NotificationCard from '@/Components/molecules/NotificationCard/NotificationCard';
import { Box, Container, Grid } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { usePage } from '@inertiajs/react';

const notifications = [
  {
    url: '#',
    text: 'Notificaitn With title and short description 1',
    date: '2023-09-11',
    isNew: true,
  },
  {
    url: '#',
    text: 'Notificaitn With title and short description 1',
    date: '2023-09-10',
    isNew: false,
  },
  {
    url: '#',
    text: 'Notificaitn With title and short description 1',
    date: '2023-09-09',
    isNew: false,
  },
];

function LandingActionSec() {
  const { width: winWidth } = useViewportSize();
  return (
    <Container size="xl">
      <Box
        mt="lg"
        style={{
          display: 'flex',
          columnGap: '20px',
          ...(winWidth < 1200 ? { flexDirection: 'column', rowGap: '20px' } : { flexDirection: 'row' }),
        }}
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 12, lg: 6,sm:12 }}>
              <ImageCarousel />
          </Grid.Col >
          <Grid.Col id='latest-announcement' span={{ base: 12, md: 12, lg: 6,sm:12 }}>
            <NotificationCard title="Latest Announcements" NotificationList={notifications} />
          </Grid.Col>
        </Grid>
      </Box>
    </Container>
  );
}
export default LandingActionSec;
