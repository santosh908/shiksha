import { Box, Button, Menu, rgba, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import { IconCaretDown, IconCaretRight, IconExternalLink } from '@tabler/icons-react';
import CustomLink from '@/Components/molecules/link/CustomLink';
import { Link } from '@inertiajs/react';

export const MenuItem = (props: {
  text: string;
  textLink?: string;
  external?: boolean;
  active?: boolean;
  onClick?: () => void; // Add onClick prop
  subMenu?: {
    text: string;
    textLink?: string;
    subSubMenu?: { text: string; textLink?: string }[];
    external?: boolean;
  }[];
}) => {
  const { text, textLink, onClick, subMenu = [], active = false } = props; // Destructure onClick
  const theme = useMantineTheme();
  const [menuState, setMenuState] = useState(false);

  if (subMenu.length > 0) {
    return (
      <Menu
        onChange={(isOpen) => setMenuState(isOpen)}
        transitionProps={{ transition: 'scale', duration: 550 }}
        withArrow
        styles={(theme) => ({
          arrow: {
            background: rgba(theme.colors.primary[1], 0.5),
            border: 'none',
          },
          dropdown: {
            zIndex: '9999',
          },
        })}
        arrowSize={10}
        trigger="click-hover"
        closeDelay={400}>
        <Menu.Target>
          <Button
            color={active ? theme.colors.primary[1] : theme.colors.primary[1]}
            variant={active ? 'filled' : 'transparent'}
            style={theme => ({
              ...(menuState ? { background: rgba(theme.colors.gray[5], 0.2) } : {}),
            })}
            fz="md"
            radius="md"
            onClick={onClick} // Attach the onClick here
          >
            <span
              style={{
                fontWeight: 'bolder !important',
                color: theme.colors.gray[9],
              }}>
              {text?.toUpperCase()}
            </span>
            <IconCaretDown color="black" size={20} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown
          p={'sm'}
          style={(theme) => ({
            background: rgba(theme.colors.primary[1], 0.95),
            border: 'none',
          })}>
          {subMenu.map((item, index) => {
            const { subSubMenu: _subSubMenu = [] } = item;
            if (_subSubMenu && _subSubMenu.length === 0) {
              if (item.external) {
                return (
                  <CustomLink isExternal href={item.textLink || '/'} key={index} style={{ textDecoration: 'none' }}>
                    <Menu.Item key={index} style={{ fontWeight: 'bold' }} color="dark">
                      {item.text}
                      {item.external && <IconExternalLink height={16} width={16} style={{ color: theme.colors.primary[9] }} />}
                    </Menu.Item>
                  </CustomLink>
                );
              }

              return (
                <Link href={item.textLink || '/'} key={index} style={{ textDecoration: 'none' }}>
                  <Menu.Item key={index} style={{ fontWeight: 'bold' }} color="dark" c={theme.colors.red[7]}>
                    {item.text} {item.external && <IconExternalLink height={16} width={16} style={{ color: theme.colors.primary[6] }} />}
                  </Menu.Item>
                </Link>
              );
            }

            return (
              <Menu.Item key={index} style={{ fontWeight: 'bold' }} color="primary">
                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Menu
                    offset={30}
                    transitionProps={{ transition: 'scale', duration: 550 }}
                    withArrow
                    styles={(theme) => ({
                      arrow: {
                        background: rgba(theme.colors.primary[1], 0.5),
                        border: 'none',
                      },
                    })}
                    arrowSize={10}
                    position="right-start"
                    trigger="click-hover"
                    closeDelay={400}>
                    <Menu.Target>
                      <Box style={{ minWidth: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.text}</span>
                        <IconCaretRight size={20} />
                      </Box>
                    </Menu.Target>
                    <Menu.Dropdown
                      p={'sm'}
                      style={(theme) => ({
                        background: rgba(theme.colors.primary[1], 0.8),
                        border: 'none',
                      })}>
                      <Menu.Item style={{ fontWeight: 'bold' }} color="primary">
                        {item.text}
                      </Menu.Item>
                      {_subSubMenu.map((subItem, subIndex) => (
                        <Menu.Item key={subIndex} style={{ fontWeight: 'bold' }} color="primary">
                          {subItem.text}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </Box>
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <CustomLink href={textLink ?? '#'} isExternal={props.external ?? false} style={{ textDecoration: 'none' }}>
      <Button
        color={active ? theme.colors.primary[6] : theme.colors.primary[9]}
        variant={active ? 'filled' : 'subtle'}
        radius="lg"
        fw="bold"
        fz="md"
        onClick={onClick} // Attach the onClick here as well
      >
        {text?.toUpperCase()}
      </Button>
    </CustomLink>
  );
};
