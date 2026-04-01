import { ActionIcon, Box, Button, Container, Flex, rgba, useMantineTheme } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import Carousel from 'nuka-carousel';
import React, { useState } from 'react';

function LandingGalaryCoursol() {
  const theme = useMantineTheme();

  const imageSlider = [
    { url: '/img1.jpg' },
    {
      url: '/img2.jpg',
    },
    {
      url: '/img3.jpg',
    },
  ];

  const [isAnimationRunning, setIsAnimationRunning] = useState(true);

  return (
    <Carousel
      {...(isAnimationRunning ? { autoplay: true } : {})}
      wrapAround
      tabbed={false}
      renderCenterRightControls={({ nextSlide }: any) => <></>}
      renderCenterLeftControls={({ previousSlide }: any) => <></>}
      renderBottomRightControls={() => {
        return (
          <Button m="sm" variant="light" onClick={() => setIsAnimationRunning(!isAnimationRunning)}>
            {isAnimationRunning ? <IconPlayerPause /> : <IconPlayerPlay />}
          </Button>
        );
      }}
      renderBottomCenterControls={({ slideCount, goToSlide, currentSlide, previousSlide, nextSlide }: any) => (
        <Flex gap="lg"  style={{ background: '#ffffff00', marginTop: '0px', marginLeft: '10px' }} align="center">
          <ActionIcon radius="xl" m="sm" onClick={previousSlide} c="primary" variant="outline">
            <IconArrowLeft />
          </ActionIcon>
          <Flex gap="lg" style={{ marginTop: '10px' }}>
            {new Array(slideCount).fill(0).map((e, index) => (
              <Box radioGroup='xl'
                key={index}
                onClick={() => goToSlide(index)}
                ></Box>
            ))}
          </Flex>
          <ActionIcon radius="xl" m="sm" onClick={nextSlide} c="primary" variant="outline">
            <IconArrowRight />
          </ActionIcon>
        </Flex>
      )}>
      {imageSlider.map((item, index) => (
        <Box key={index}>
          <Flex
            justify="center">
            <img 
              src={item.url}
              height={200}
              border-radius={20}
              width="auto"
              style={{
                minHeight: '200px',
                maxHeight: '200px',
              }}
            />
          </Flex>
        </Box>
      ))}
    </Carousel>
  );
}

export default LandingGalaryCoursol;
