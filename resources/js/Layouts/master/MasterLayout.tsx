import { errorLogService } from '@/Services/errorLogService';
import { router } from '@inertiajs/react';
import { Center, Loader, MantineColorsTuple, MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ErrorBoundary } from 'react-error-boundary';
import React, { useEffect, useState } from 'react';
import ErrorFallback from './ErrorFallback';
import { Notifications } from '@mantine/notifications';

const primaryColor: MantineColorsTuple = [
  '#fff4e2',
  '#ffe7cc',
  '#ffcf9b',
  '#ffb464',
  '#fe9d38',
  '#fe8f1b',
  '#ff8809',
  '#e47500',
  '#cb6700',
  '#b05700',
];

const theme = createTheme({
  colors: {
    primary: primaryColor,
  },
  defaultGradient: {
    deg: 90,
  },
  primaryColor: 'primary',
});

/**
 * Defines the props for the `MasterLayout` component.
 * @interface MasterLayoutProps
 * @property {React.ReactNode} children - The content to be rendered within the master layout.
 */
type MasterLayoutProps = {
  children: React.ReactNode;
};

/**
 * Renders the master layout for the application, providing the Mantine provider.
 *
 * @param {MasterLayoutProps} props - The props for the master layout.
 * @param {React.ReactNode} props.children - The content to be rendered within the master layout.
 * @returns {React.ReactElement} The master layout component.
 */
function MasterLayout({ children }: MasterLayoutProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const removeStart = router.on('start', () => setIsLoading(true));
    const removeFinish = router.on('finish', () => setIsLoading(false));
    const removeError = router.on('error', () => setIsLoading(false));
    const removeInvalid = router.on('invalid', () => setIsLoading(false));
    const removeException = router.on('exception', () => setIsLoading(false));

    return () => {
      removeStart();
      removeFinish();
      removeError();
      removeInvalid();
      removeException();
    };
  }, []);

  return (
    <ErrorBoundary onError={(error, info) => errorLogService.logError(error, info)} FallbackComponent={ErrorFallback}>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>
          {children}
          {isLoading ? (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 9999,
              }}
            >
              <Center style={{ width: '100%', height: '100%', flexDirection: 'column', gap: 12 }}>
                <Loader size="lg" color="orange" />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#555' }}>Loading...</div>
              </Center>
            </div>
          ) : null}
        </ModalsProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default MasterLayout;
