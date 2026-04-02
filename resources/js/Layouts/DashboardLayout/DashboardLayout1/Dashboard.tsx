import FooterNav from '@/Components/molecules/DashboardComponents/FooterNav';
import HeaderNav from '@/Components/molecules/DashboardComponents/HeaderNav';
import Navigation from '@/Components/molecules/DashboardComponents/Navigation';
import GeneralUserLayout from '@/Layouts/regular_user/GeneralUserLayout';
import { usePage } from '@inertiajs/react';
import { AppShell, Container, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import React, { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { IconAlertCircle, IconInfoCircle, IconCircleCheck } from '@tabler/icons-react';

type FlashMessages = {
  error?: string;
  success?: string;
  info?: string;
};

type PageProps = {
  flash: FlashMessages;
};

type DashboardProps = {
  children: React.ReactNode;
};

function Dashboard({ children }: DashboardProps) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { props } = usePage<PageProps>(); // Use the defined type here

  useEffect(() => {
    if (props.flash?.error) {
      showNotification({
        title: 'Error',
        message: props.flash.error,
        withBorder: true,
        autoClose: 10000,
        position: 'top-right',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
        styles: (theme) => ({
          root: {
            border: '1px solid red',
            borderColor: 'red',
            borderWidth: '1px',
            borderStyle: 'doted',
          }
        })
      });
      //@ts-ignore
      props.flash.error = null; 
    }
  }, [props.flash?.error]);

  useEffect(() => {
    if (props.flash?.success) {
      showNotification({
        title: 'Success',
        message: props.flash.success,
        withBorder: true,
        autoClose: 8000,
        position: 'top-right',
        color: 'teal',
        icon: <IconCircleCheck size={16} />,
      });
      //@ts-ignore
      props.flash.success = null;
    }
  }, [props.flash?.success]);

  useEffect(() => {
    if (props.flash?.info) {
      showNotification({
        title: 'Notice',
        message: props.flash.info,
        withBorder: true,
        autoClose: 12000,
        position: 'top-right',
        color: 'blue',
        icon: <IconInfoCircle size={16} />,
      });
      //@ts-ignore
      props.flash.info = null;
    }
  }, [props.flash?.info]);

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
