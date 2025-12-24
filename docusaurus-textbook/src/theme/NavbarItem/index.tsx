import React, { JSX } from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import type { NavbarItemConfig } from '@docusaurus/theme-common';
import CustomNavbarAuthNavbarItem from './NavbarAuth';

// Extend the NavbarItemConfig type to include our custom type
declare module '@docusaurus/theme-common' {
  export interface NavbarItemConfig {
    readonly type?:
      | 'custom-navbarAuth'
      | 'doc'
      | 'docsVersion'
      | 'docsVersionDropdown'
      | 'localeDropdown'
      | 'search'
      | 'theme'
      | 'dropdown'
      | 'html'
      | 'link';
  }
}

// Define the mapping between type and component
const TypeToComponent = {
  'custom-navbarAuth': CustomNavbarAuthNavbarItem,
  // Add other default navbar item types
  'doc': NavbarItem,
  'docsVersion': NavbarItem,
  'docsVersionDropdown': NavbarItem,
  'localeDropdown': NavbarItem,
  'search': NavbarItem,
  'theme': NavbarItem,
  'dropdown': NavbarItem,
  'html': NavbarItem,
  'link': NavbarItem,
};

interface NavbarItemProps {
  readonly item: NavbarItemConfig;
}

export default function NavbarItemAdapter(props: NavbarItemProps): JSX.Element {
  // Check if props.item is defined before destructuring
  if (!props.item) {
    // If no item is provided, return null or a default component
    return <></>; // or return <NavbarItem /> with default props
  }

  const { type = 'link', ...propsRest } = props.item;
  const Component = TypeToComponent[type];

  if (!Component) {
    throw new Error(
      `No NavbarItem component found for type '${type}'.\nAvailable types: ${Object.keys(
        TypeToComponent,
      ).join(', ')}.`,
    );
  }

  return <Component {...propsRest} />;
}