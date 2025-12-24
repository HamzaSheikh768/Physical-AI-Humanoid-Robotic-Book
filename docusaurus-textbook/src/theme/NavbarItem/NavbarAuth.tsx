import React, { JSX } from 'react';
import type { NavbarItemConfig } from '@docusaurus/theme-common';
import type { LinkLikeNavbarItemProps } from '@theme/NavbarItem';
import AuthNavbarItem from '@site/src/components/AuthNavbarItem';

// Define the props type for our custom navbar item
type CustomNavbarAuthConfig = {
  type: 'custom-navbarAuth';
  position?: 'left' | 'right';
  className?: string;
} & Omit<LinkLikeNavbarItemProps, 'type'>;

// The custom navbar item component
export default function CustomNavbarAuthNavbarItem(
  props: CustomNavbarAuthConfig,
): JSX.Element {
  const { position, className } = props;
  return <AuthNavbarItem position={position} className={className} />;
}