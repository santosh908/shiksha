import { Box, Button, Container, Flex, Image } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import NavUtils from '../Navbar/NavUtils';
import { Link } from '@inertiajs/react';

import styles from './LandingTopHeader.module.css';
import NavbarMenu from '../Navbar/NavMenu';

const TopHeaderNav = () => {
  const [scroll, _] = useWindowScroll();

  return (
    <Box className={`${styles.root}`}>
      <NavUtils />
      <Box
        style={theme => ({
          position: scroll.y > 50 ? 'fixed' : 'sticky',
          top: '0',
          zIndex: '10',
          width: '100%',
          borderBottom: scroll.y > 50 ? `3px solid ${theme.colors.primary[3]}` : 'none',
        })}
        className={styles.navBack}>
        <Container size={'xl'} style={{ padding: '8px', paddingLeft: '20px', paddingRight: '20px' }}>
          <Flex align="center" style={{ width: '100%' }} justify="space-between">
            <Flex align="center" gap="lg">
              <Link href="/">
                <Image className="nav_logo" style={{ maxHeight: '80px' }} src={`/${scroll.y > 50 ? 'logo' : 'logo'}.webp`}></Image>
              </Link>
              <NavbarMenu />
            </Flex>
            <Flex>
            <Button variant="filled" component={Link} href="/register" style={{ marginRight: '10px' }}
            >
              Register
            </Button>
              <Button variant="filled" component={Link} href="/login" style={{ marginRight: '10px' }}>
                Login
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
};

export default TopHeaderNav;
