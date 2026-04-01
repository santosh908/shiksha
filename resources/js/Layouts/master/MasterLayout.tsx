import useMasterApplicationStore from '@/Store/MasterApplication.store';
import { Head } from '@inertiajs/react';
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';
import React, { Fragment } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
// import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';
import { error } from 'console';
import { errorLogService } from '@/Services/errorLogService';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
// import errorFallback from './ErrorFallback';

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
  return (
    <ErrorBoundary onError={(error, info) => errorLogService.logError(error, info)} FallbackComponent={ErrorFallback}>
      <MantineProvider theme={theme}>
        <Notifications />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default MasterLayout;
