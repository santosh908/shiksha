import React from 'react';
import GuestLayout from './GuestLayout';
import TopHeaderNav from '@/Components/organisms/LandingTopHeader/TopHeaderNav';
import TopBanner from '@/Components/molecules/TopBanner/TopBanner';
import Breadcrumb from '@/Components/molecules/breadcrumb/Breadcrumb';
import FotterComman from '@/Components/organisms/Fotter.tsx/FotterComman';
import { Box, Container, Flex } from '@mantine/core';

type GuestNonLandingLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

function GuestNonLandingLayout({ children, pageTitle }: GuestNonLandingLayoutProps) {
  return (
    <GuestLayout>
      <TopHeaderNav />
      <TopBanner />
      <Breadcrumb titile={pageTitle} />
      <Container size="xl" p={{ base: 'xs', sm: 'md' }}>
        <Flex mih={{ base: 200, sm: 320 }} className="w-full" justify="flex-start" align="stretch" direction="column">
          {children}
        </Flex>
      </Container>
      <FotterComman />
    </GuestLayout>
  );
}

export default GuestNonLandingLayout;
