import FooterNav from '@/Components/molecules/DashboardComponents/FooterNav';
import HeaderNav from '@/Components/molecules/DashboardComponents/HeaderNav';
import Navigation from '@/Components/molecules/DashboardComponents/Navigation';
import GeneralUserLayout from '@/Layouts/regular_user/GeneralUserLayout';
import { AppShell, Container, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React from 'react';

type DashboardProps = {
  children: React.ReactNode;
};

function Dashboard({ children }: DashboardProps) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <GeneralUserLayout>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        footer={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'md',
          collapsed: {
            mobile: !mobileOpened,
            desktop: !desktopOpened,
          },
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
            <HeaderNav desktopOpened={desktopOpened} mobileOpened={mobileOpened} toggleDesktop={toggleDesktop} toggleMobile={toggleMobile} />
          </Container>
        </AppShell.Header>

        <AppShell.Navbar>
          {/* Left Side Bar */}
          <Navigation onClose={toggleMobile} />
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>

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
