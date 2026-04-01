import { ActionIcon, Box, Button,Text, Container, Flex, rgba, useMantineTheme, Title, Badge } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import Carousel from 'nuka-carousel';
import React, { useState } from 'react';
import styles from './LandingTopHeader.module.css';
import { useMediaQuery } from '@mantine/hooks';

function LandingMainCoursol({ landingSectionRef }:any) {
  const scrollToSection = () => {
    if (landingSectionRef.current) {
      landingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const theme = useMantineTheme();
 
  const imageSlider = [
    { url: '/banner/banner1.jpeg' },
    {
      url: '/banner/banner2.jpeg',
    },
    {
      url: '/banner/banner3.jpeg',
    },
    {
      url: '/banner/banner4.jpeg',
    },
  ];

  const isSmallDevice = useMediaQuery('(max-width: 768px)');

  const [isAnimationRunning, setIsAnimationRunning] = useState(true);

  return (
    <Carousel
      {...(isAnimationRunning ? { autoplay: true } : {})}
      wrapAround
      tabbed={false}
      style={{
        margin: '0',
      }}
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
        <Flex gap="lg" style={{ background: '#ffffff00', marginTop: '0px', marginLeft: '10px' }} align="center">
          <ActionIcon radius="xl" m="sm" onClick={previousSlide} c="primary" variant="outline">
            <IconArrowLeft />
          </ActionIcon>
          <Flex gap="lg" style={{ marginTop: '10px' }}>
            {new Array(slideCount).fill(0).map((e, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  height: '10px',
                  width: currentSlide === index ? '30px' : '10px',
                  background: currentSlide === index ? rgba(theme.colors.primary[9], 1) : rgba(theme.colors.primary[0], 0.9),

                  borderRadius: '8px',
                  transition: 'all 0.3s ease-in-out',
                  marginBottom: '10px',
                  boxShadow: 'var(--mantine-shadow-sm)',
                  border: '1px solid ' + theme.colors.primary[9],
                  cursor: 'pointer',
                }}></Box>
            ))}
          </Flex>
          <ActionIcon radius="xl" m="sm" onClick={nextSlide} c="primary" variant="outline">
            <IconArrowRight />
          </ActionIcon>
        </Flex>
      )}>
      {imageSlider.map((item, index) => (
        <Box
          key={index}
          style={{
            position: 'relative',
          }}>
          <Flex
            justify="center"
            className={styles.sliderBackground}
            style={{
              minWidth: 'max(100%,1400px)',
              height: '100%',
              position: 'relative',
              '--image_slider_src': `url(${item.url})`,
            }}
            >
            <img
              src={item.url}
              height={600}
              width="100%"
              style={{
                minHeight: '600px',
                maxHeight: '600px',
              }}
            />
          </Flex>

          <Box
      style={{
        position: 'absolute',
        margin: 'auto',
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
      }}
    >
      <Flex
        style={{
          position: 'absolute',
          margin: 'auto',
          bottom: 0,
          color: 'white',
          width: '100%',
          background: `linear-gradient(0deg, black 0%, #000000 10%, rgba(0,212,255,0) 100%)`,
          height: '100px',
        }}
      >
        <Container></Container>
      </Flex>

      {/* Text and link with red-tinted background */}
      <Flex
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(0deg, #0000009e 0%, rgb(0 0 0 / 72%) 10%, rgba(0, 112, 255, 0) 100%)`,
          padding: isSmallDevice ? '10px' : '30px', // Adjust padding for small devices
          borderRadius: '8px',
          flexDirection: isSmallDevice ? 'column' : 'row', // Stack content on small devices
        }}
        direction="column"
      >
        <Flex
          style={{
            position: 'absolute',
            right: isSmallDevice ? '0px' : '20px', // Adjust position for small devices
            top: isSmallDevice ? '20%' : '60%', // Adjust position for small devices
            bottom: '0px',
            width: isSmallDevice ? '100%' : '50%', // Full width on small devices
            height: '100%',
            transform: isSmallDevice ? 'none' : 'translateY(-50%)',
            padding: '30px',
            borderRadius: '8px',
            color: 'white',
            alignItems: 'center',
          }}
          direction="column"
        >
          <Box style={{ textAlign: 'center' }}>
            <Badge py={isSmallDevice ? 10 : 20}>
              <Title
                order={1}
                style={{ fontSize: isSmallDevice ? 'clamp(20px, 5vw, 36px)' : 'clamp(24px, 5vw, 35px)' }}
              >
                Dwarka ISKCON
              </Title>
            </Badge>
            <Title
              py={isSmallDevice ? 10 : 20}
              order={2}
              style={{ fontSize: isSmallDevice ? 'clamp(16px, 4vw, 28px)' : 'clamp(18px, 4vw, 32px)' }}
            >
              CONNECTING WITH SPIRITUALITY
            </Title>
            <Title
              py={isSmallDevice ? 10 : 20}
              order={3}
              style={{ fontSize: isSmallDevice ? 'clamp(14px, 3.5vw, 24px)' : 'clamp(14px, 3.5vw, 24px)' }}
            >
              Latest Announcements - View all Announcements and notifications of Dwarka ISKCON
            </Title>
            <Box>
              <Button
                mt={isSmallDevice ? 10 : 20}
                component="a"
                variant="light"
                color="white"
                style={{ borderColor: 'white', fontSize: isSmallDevice ? 'clamp(12px, 2.5vw, 16px)' : '16px' }}
                onClick={scrollToSection}
              >
                View Announcements
              </Button>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
        </Box>
      ))}
    </Carousel>
  );
}

export default LandingMainCoursol;
