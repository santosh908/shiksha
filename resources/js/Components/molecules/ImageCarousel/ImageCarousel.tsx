import { ActionIcon, Anchor, Badge, Box, Button, Container, Flex, List, Title, rem, rgba, useMantineTheme } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';
import Carousel from 'nuka-carousel';
import { useState } from 'react';
import styles from './ImageScrousel.Module.css';

function ImageCarousel() {
  const imageSlider = [
    { url: '/img1.jpg', link: '/cfpid/generate' },
    { url: '/img2.jpg', external: true, link: '#' },
  ];

  const [isAnimationRunning, setIsAnimationRunning] = useState(true);

  // use responsive size
  const { width: winWidth } = useViewportSize();

  const theme = useMantineTheme();

  return (
    <Box
      style={{
        minHeight: '200px',
        boxShadow: 'var(--mantine-shadows-sm)',
      }}
    > 
      <Carousel
        {...(isAnimationRunning ? { autoplay: true } : {})}
        wrapAround
        autoplayInterval={5000}
        tabbed={false}
        style={{
          margin: '0',
          borderRadius: '10px',
          boxShadow: 'var(--mantine-shadow-sm)',
          border: '2px solid white',
        }}
        renderCenterRightControls={({ nextSlide }) => <></>}
        renderCenterLeftControls={({ previousSlide }) => <></>}
        renderBottomRightControls={() => (
          <Button m="sm" variant="subtle" color="gray" onClick={() => setIsAnimationRunning(!isAnimationRunning)}>
            {isAnimationRunning ? <IconPlayerPause /> : <IconPlayerPlay />}
          </Button>
        )}
        renderBottomCenterControls={({ slideCount, goToSlide, currentSlide, previousSlide, nextSlide }) => (
          <Flex gap="lg" style={{ background: '#ffffff00', marginTop: '0px', marginLeft: '10px' }} align="center">
            <ActionIcon radius="xl" m="sm" onClick={previousSlide} c="primary" variant="white">
              <IconArrowLeft />
            </ActionIcon>
            <Flex gap="lg" style={{ marginTop: '10px' }}>
              {new Array(slideCount).fill(0).map((_, index) => (
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
                  }}
                ></Box>
              ))}
            </Flex>
            <ActionIcon radius="xl" m="sm" onClick={nextSlide} c="primary" variant="white">
              <IconArrowRight />
            </ActionIcon>
          </Flex>
        )}
      >
        {imageSlider.map((item, index) => (
          <Anchor key={index} href={item.link} target="_blank">
            <Box key={index} style={{ position: 'relative' }}>
              <Flex
                justify="center"
                style={{
                  maxHeight: '450px', // Setting maxHeight to 450px
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden', // Ensure the image doesn't overflow the container
                }}
              >
                <img
                  src={item.url} // Using the image from item.url
                  style={{
                    objectFit: 'cover', // Ensures the image covers the entire container
                    width: '100%', // Ensures full width
                    height: '100%', // Ensures full height within the set maxHeight
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
                    height: '100px',
                  }}
                >
                  <Container></Container>
                </Flex>
              </Box>
            </Box>
          </Anchor>
        ))}
      </Carousel>
    </Box>
  );
}

export default ImageCarousel;
