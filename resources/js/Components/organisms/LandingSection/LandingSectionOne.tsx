import { Box, Container } from '@mantine/core';
import React from 'react';
import LandingActionSec from './LandingActionSec';

function LandingSectionOne() {

  
  return (
    <Container p="0" fluid>
      <Box
        mih={150}
        className="w-full"
        style={{ background: "url('/mountain.png')", backgroundPositionX: 'center', backgroundRepeat: 'repeat-x' }}></Box>

      <LandingActionSec />
    </Container>
  );
}

export default LandingSectionOne;
