import React from 'react';
import OriginalFooter from '@theme-original/Footer';
import { useLocation } from '@docusaurus/router';

export default function Footer() {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return null;
  }

  return <OriginalFooter />;
}
