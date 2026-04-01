// StatusBadge.tsx
import React from 'react';
import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
}

const DevoteeTypeBaged: React.FC<StatusBadgeProps> = ({ status }) => {
  let color = 'red'; // Default color
  let label = 'Rejected'; // Default label

  if (status === 'AD') {
    color = 'yellow';
    label = 'Ashray Devotee';
  } else if (status === 'OD') {
    color = 'green'; // Corrected color name
    label = 'Online Devote';
  } else {
    color = 'red'; // Corrected color name
    label = 'New to ISKCON';
  }

  return <Badge color={color}>{label}</Badge>;
};

export default DevoteeTypeBaged;
