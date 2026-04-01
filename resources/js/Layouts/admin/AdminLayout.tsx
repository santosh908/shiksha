import React from 'react';
import MasterAuthLayout from '../master/MasterAuthLayout';

/**
 * Defines the props for the `AdminLayout` component.
 *
 * @param children - The React nodes to be rendered within the `AdminLayout`.
 */
type AdminLayoutProps = {
  children: React.ReactNode;
};

/**
 * Renders the `AdminLayout` component, which wraps the provided `children` elements with the `MasterAuthLayout` component.
 *
 * @param children - The React nodes to be rendered within the `AdminLayout`.
 * @returns The rendered `MasterAuthLayout` component with the provided `children`.
 */
function AdminLayout({ children }: AdminLayoutProps): React.ReactElement {
  return <MasterAuthLayout>{children}</MasterAuthLayout>;
}

export default AdminLayout;
