import { Link } from '@inertiajs/react';
import { Anchor, Button, Flex, useMantineTheme } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconLink, IconWorldDownload } from '@tabler/icons-react';
import { useEffect } from 'react';
import Timer from '../timer/Timer';

type CustomLinkProps = {
  isExternal?: boolean;
  href?: string;
  children: React.ReactNode;
};

const CustomLink = ({ isExternal = false, href = '#', children, style, ...props }: CustomLinkProps & React.ComponentProps<typeof Link>) => {
  const theme = useMantineTheme();

  if (!isExternal) {
    return (
      <Link className="hover:underline" href={href} style={{ color: theme.colors.primary[8], ...style }} {...props}>
        {children}
      </Link>
    );
  }

  //   const handleExternalLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  //     e.preventDefault();
  //     const openModelTimer = modals.open({
  //       title: (
  //         <Flex align="center" style={{ fontWeight: 'bold', color: theme.colors.primary[9] }}>
  //           {' '}
  //           <IconLink style={{ color: theme.colors.primary[9] }} /> External Link Found!
  //         </Flex>
  //       ),
  //       centered: true,
  //       children: <ModelChild />,
  //     });

  //     function ModelChild() {
  //       useEffect(() => {
  //         const timeout = setTimeout(() => {
  //           // open in current tab
  //           window.open(href, '_blank');
  //         }, 4000);

  //         return () => clearTimeout(timeout);
  //       });

  //       return (
  //         <Flex direction="column" gap={10}>
  //           <Timer time={3} />
  //           <a href={href} style={{ color: theme.colors.primary[7], wordWrap: 'break-word', textDecoration: 'underline', textAlign: 'center' }}>
  //             {href}
  //           </a>
  //           <Flex gap={20} style={{ marginTop: 20 }}>
  //             <Button fullWidth onClick={() => window.open(href, '_self')}>
  //               Open In Current Tab <span style={{ width: '10px' }}></span> <IconWorldDownload style={{ height: 20, width: 20 }} />
  //             </Button>
  //             <Button
  //               onClick={() => {
  //                 modals.closeAll();
  //               }}
  //               variant="outline"
  //               color="primary"
  //               fullWidth>
  //               Close
  //             </Button>
  //           </Flex>
  //         </Flex>
  //       );
  //     }
  //   };

  return (
    //@ts-ignore
    <Anchor target="_blank" className="hover:underline" href={href} style={{ color: theme.colors.primary[9], ...style }} {...props}>
      {children}
    </Anchor>
  );
};

export default CustomLink;
