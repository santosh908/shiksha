import AppMain from '@/Components/molecules/DashboardComponents/AppMain';
import FooterNav from '@/Components/molecules/DashboardComponents/FooterNav';
import HeaderNav from '@/Components/molecules/DashboardComponents/HeaderNav';
import Navigation from '@/Components/molecules/DashboardComponents/Navigation';
import UserDashboard from '@/Components/organisms/Dashboard/UserDashboard';
import CompleteRegistration from '@/Components/organisms/PostRegistration/CompleteRegistration';
import GeneralUserLayout from '@/Layouts/regular_user/GeneralUserLayout';
import useUserStore from '@/Store/User.store';
import { AppShell, Container, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React from 'react';

function Dashboard() {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { account_approved:AccountApproved } = useUserStore();
  return (
    <GeneralUserLayout>
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header
            style={{
              height: 'rem(60)',
              border: 'none',
              boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
            }}
          >
          <Container fluid py="sm" px="lg">
            <HeaderNav
              desktopOpened={desktopOpened}
              mobileOpened={mobileOpened}
              toggleDesktop={toggleDesktop}
              toggleMobile={toggleMobile}
            />
          </Container>
      </AppShell.Header>

      <AppShell.Navbar>
       <Navigation onClose={toggleMobile} />
      </AppShell.Navbar>

      <AppShell.Main>
        {AccountApproved === 'Y' ? (
          <UserDashboard />
        ) : (
          <CompleteRegistration />
        )}
      </AppShell.Main>

      <AppShell.Footer p="md">
        <Container fluid px="lg">
          <FooterNav />
        </Container>
      </AppShell.Footer>
      
    </AppShell>
    </GeneralUserLayout>
  );
}

export default Dashboard;
