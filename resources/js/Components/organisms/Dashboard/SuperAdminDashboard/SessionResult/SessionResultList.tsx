import React from 'react';
import useUserStore from '@/Store/User.store';
import SessionResultListBase from '@/Components/organisms/Dashboard/Common/SessionResult/SessionResultListBase';

export default function SessionResultListComponent() {
  const { roles: roleName } = useUserStore();
  const roleSlug = Array.isArray(roleName) && roleName.length ? roleName[0] : 'Action';

  return (
    <SessionResultListBase
      dashboardHref={`/${roleSlug}/dashboard`}
      sessionRouteName="Action.sessionresultlist"
      encodeSessionForRoute
    />
  );
}
