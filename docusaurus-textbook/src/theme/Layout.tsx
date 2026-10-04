import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import ChatWidget from '../components/chat/ChatWidget';
import { AuthProvider } from '../contexts/AuthContext';
import { MotionConfig } from 'framer-motion';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps): React.ReactElement {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <OriginalLayout {...props}>
          {props.children}
          <ChatWidget />
        </OriginalLayout>
      </AuthProvider>
    </MotionConfig>
  );
}
