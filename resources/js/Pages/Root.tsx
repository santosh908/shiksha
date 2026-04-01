import FotterComman from '@/Components/organisms/Fotter.tsx/FotterComman';
import FaqSection from '@/Components/organisms/LandingSection/FaqSection';
import LandingSectionOne from '@/Components/organisms/LandingSection/LandingSectionOne';
import LandingSectionThree from '@/Components/organisms/LandingSection/LandingSectionThree';
import LandingMainCoursol from '@/Components/organisms/LandingTopHeader/LandingMainCoursol';
import TopHeaderNav from '@/Components/organisms/LandingTopHeader/TopHeaderNav';
import GuestLayout from '@/Layouts/guest/GuestLayout';
import { Head } from '@inertiajs/react';
import { Box, Container } from '@mantine/core';
import { useRef } from 'react';

export default function Page() {
  const landingSectionRef = useRef(null);
  return (
    <GuestLayout>

      <Head title="Home" />

      <TopHeaderNav />

      <LandingMainCoursol landingSectionRef={landingSectionRef}/>

      <Container p="0" fluid mih={400}>
        <div ref={landingSectionRef}>
          <LandingSectionOne />
        </div>
      </Container>

      <LandingSectionThree />

      <FaqSection />

      <Container p="0" fluid>
        <Box
          mih={150}
          className="w-full"
          style={{
            background: "url('/mountain.png')",
            transform: 'rotate(180deg)',
            backgroundPositionX: 'center',
            backgroundRepeat: 'repeat-x',
          }}></Box>
      </Container>
      
      <FotterComman />
      {/* <Container mih={50}></Container> */}
    </GuestLayout>
  );
}
