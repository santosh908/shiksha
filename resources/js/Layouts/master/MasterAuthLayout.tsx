import React from 'react';
import MasterLayout from './MasterLayout';

/**
 * Defines the props for the `MasterAuthLayout` component.
 *
 * @interface MasterAuthLayoutProps
 * @property {React.ReactNode} children - The child components to render within the `MasterLayout`.
 */
type MasterAuthLayoutProps = {
  children: React.ReactNode;
};

/**
 * Renders the `MasterLayout` component with the provided children.
 *
 * @param {MasterAuthLayoutProps} props - The props for the `MasterAuthLayout` component.
 * @param {React.ReactNode} props.children - The child components to render within the `MasterLayout`.
 * @returns {React.ReactElement} The rendered `MasterLayout` component.
 */
function MasterAuthLayout({ children }: MasterAuthLayoutProps): React.ReactElement {
  return <MasterLayout>{children}</MasterLayout>;
}

export default MasterAuthLayout;
