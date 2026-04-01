import useMasterApplicationStore from '@/Store/MasterApplication.store';
import { Head, usePage } from '@inertiajs/react';
import React, { Fragment, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
type GuestLayoutProps = {
  children: React.ReactNode;
};

function GuestLayout({ children }: GuestLayoutProps): React.ReactElement {
  const { appTitle } = useMasterApplicationStore();
  const { errors } = usePage().props;

  useEffect(() => {
    if (Object.values(errors).length) {
      notifications.show({
        title: 'Error',
        message: Object.values(errors)[0],
        color: 'red',
      });
    }
  }, [errors]);

  return (
    <Fragment>
      <Head title={appTitle}></Head>
      {children}
    </Fragment>
  );
}

export default GuestLayout;
