import React, { useEffect } from 'react';
import MasterAuthLayout from '../master/MasterAuthLayout';
import { usePage } from '@inertiajs/react';
import useUserStore from '@/Store/User.store';
import User from '@/Components/Types/User.types';
import { modals } from '@mantine/modals';
import { Box, Button, Flex, Title, useMantineTheme } from '@mantine/core';
import { IconCheck, IconRosetteDiscountCheck } from '@tabler/icons-react';
/**
 * Defines the props for the `GeneralUserLayout` component, which includes the `children` prop that represents the React nodes to be rendered within the layout.
 */
type GeneralUserLayoutProps = {
  children: React.ReactNode;
};

/**
 * Renders the `GeneralUserLayout` component, which wraps the provided `children` elements with the `MasterAuthLayout` component.
 *
 * @param {GeneralUserLayoutProps} props - The props for the `GeneralUserLayout` component.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the `MasterAuthLayout`.
 * @returns {React.ReactElement} The rendered `GeneralUserLayout` component.
 */
function GeneralUserLayout({ children }: GeneralUserLayoutProps): React.ReactElement {
  const page = usePage<any>();
  const { setUserMultiValue } = useUserStore();

  const theme = useMantineTheme();

  useEffect(() => {
    const { props } = page;
    const { user, notification } = props as any;

    setUserMultiValue(user as User);

    if (typeof notification !== 'undefined') {
      modals.open({
        children: (
          <Box className="w-100 ">
            <Flex justify="center" direction="column" align="center">
              <IconRosetteDiscountCheck size={110} color={theme.colors.green[5]} />
              <Title order={2} className="text-green-700">
                {notification}
              </Title>
              <Button
                mt="lg"
                onClick={() => {
                  modals.closeAll(); // Close the modal on click
                }}
                color="gray"
              >
                OK
              </Button>
            </Flex>
          </Box>
        ),
        centered: true,
      });
    }
  }, [page]);

  return <MasterAuthLayout>{children}</MasterAuthLayout>;
}

export default GeneralUserLayout;
