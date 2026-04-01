import CustomLink from '@/Components/molecules/link/CustomLink';
import useThemeStore from '@/theme';
import { ActionIcon, Anchor, Box, Button, ColorPicker, darken, Flex, Popover, useMantineTheme } from '@mantine/core';
import { IconArrowForward, IconColorPicker, IconMinus, IconPlus, IconSitemap } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

const NavUtils = () => {
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Adjust the breakpoint as per your design

  const [currentZoom, setCurrentZoom] = useState(100);
  const [themeColor, setThemeColor] = useState('#85878c');
  const { currentTheme, setTheme }: any = useThemeStore();

  useEffect(() => {
    document.body.style.zoom = currentZoom + '%';
  }, [currentZoom]);

  useEffect(() => {
    setTheme(themeColor);
  }, [themeColor]);

  const zoomIn = () => {
    setCurrentZoom(currentZoom + 5);
  };

  const zoomOut = () => {
    setCurrentZoom(currentZoom - 5);
  };

  return (
    <Box
      style={{
        background: '#290909',
        minHeight: '40px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        columnGap: '10px',
        flexWrap: 'wrap',
      }}>
      <Box style={{ width: '100%' }}></Box>

      {/* Main Flex Container Right-Aligned */}
      <Flex justify="flex-end" style={{ width: '100%' }} gap="sm" align="center">
        {/* Skip to Content */}
        <Anchor
          onClick={() => {
            window.scrollTo({ top: 50 });
          }}
          style={{ minWidth: 'max-content', cursor: 'pointer', color: darken(theme.colors.primary[9], 0.2) }}>
          <Flex c="white">
            <IconArrowForward />
            Skip to Main Content
          </Flex>
        </Anchor>

        {/* Color Picker */}
        <Popover>
          <Popover.Target>
            <ActionIcon>
              <IconColorPicker />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker
              value={currentTheme}
              onChange={e => {
                setThemeColor(e);
              }}
            />
          </Popover.Dropdown>
        </Popover>

        {/* Divider */}
        <Box
          style={{
            width: '2px',
            background: theme.colors.primary[9],
            height: '30px',
          }}
        ></Box>

        {/* Sitemap Link */}
        <CustomLink href="/sitemap">
          <Flex c="white">
            <IconSitemap />
            Sitemap
          </Flex>
        </CustomLink>

        {/* Divider */}
        <Box
          style={{
            width: '2px',
            background: '#fff',
            height: '30px',
          }}
        ></Box>

        {/* Zoom Controls */}
        <Flex  gap="sm" align="center">
          <Button variant="light" size="xs" onClick={zoomOut}>
            <IconMinus />
          </Button>

          {!isSmallScreen && (
            <Flex align="center" c="white">
              {currentZoom + '%'}
            </Flex>
          )}

          <Button variant="light" size="xs" onClick={zoomIn}>
            <IconPlus />
          </Button>

          {isSmallScreen && (
            <Flex align="center" c="white">
              {currentZoom + '%'}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavUtils;
