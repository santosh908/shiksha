import { Group, Divider, Box, Burger, Drawer, ScrollArea, rem, useMantineTheme, rgba, Modal, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MenuItem } from './MenuItem';
import { useState } from 'react';
import { router } from '@inertiajs/react';

const NavbarMenu = (props: any) => {
  const { active } = props;

  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [modalOpened, setModalOpened] = useState(false); // State for modal
  const theme = useMantineTheme();

  const handleAboutUsClick = () => {
    if (drawerOpened) {
      closeDrawer(); // Close drawer if it's open
    }
    setModalOpened(true); // Open modal when About Us is clicked
  };

  const handleModalClose = () => {
    setModalOpened(false); // Close modal
  };


  return (
    <>
      <Box className="h-[48px] px-[8px] py-[4px] gap-[4px] rounded-[20px]" style={{ background: rgba(theme.colors.primary[1], 0.1) }}>
        <header>
          <Group justify="space-between" h="100%">
            <Group h="100%" gap={0} visibleFrom="sm">
              <MenuItem text="Home" textLink="/" active={active === 'home'} />
              <MenuItem text="About Us" onClick={() => window.open('https://iskcondwarka.org/', '_blank', 'noopener,noreferrer')} active={active === 'about-us'} /> 
              <MenuItem text="Shiksha Program" textLink='/ShikshaProgram' active={active === 'Shiksha Program'} />
              <MenuItem text="Announcements" textLink='/#latest-announcement' active={active === 'Announcements'} />
              <MenuItem text="Contact Us" textLink='/contact-us' active={active === 'contact-us'} />
            </Group>
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>

        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Shiksha App"
          hiddenFrom="sm"
          zIndex={1000000} 
        >
          <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
            <Divider my="sm" />
            <MenuItem text="Home" textLink="/" active={active === 'home'} />
            <Divider my="sm" />
            <MenuItem text="About Us" onClick={() => window.open('https://iskcondwarka.org/', '_blank', 'noopener,noreferrer')} active={active === 'about-us'} />
            <Divider my="sm" />
            <MenuItem text="Shiksha Program" textLink='/ShikshaProgram' active={active === 'ShikshaLavelInfo'} />
            {/* textLink="/ShikshaLavelInfo" */}
            <Divider my="sm" />
            <MenuItem text="Announcements" textLink='/#latest-announcement' active={active === 'Announcements'} />
            {/* textLink="/faq" */}
            <Divider my="sm" />
            <MenuItem text="Contact Us" textLink='/contact-us' active={active === 'contact-us'} />
            {/* textLink="/contact-us" */}
            <Divider my="sm" />
            <MenuItem text="Register" textLink="/register" active={active === 'register'} />
            <Divider my="sm" />
            <MenuItem text="Login" textLink="/login" active={active === 'login'} />
            <Divider my="sm" />
          </ScrollArea>
        </Drawer>
      </Box>

      {/* Modal component */}
      <Modal
        opened={modalOpened}
        onClose={handleModalClose} // Ensure it closes only on this function
        title="About Us"
        centered
      >
        This section will be coming soon.
        <Button onClick={handleModalClose} mt="md">Close</Button>
      </Modal>
    </>
  );
}

export default NavbarMenu;
