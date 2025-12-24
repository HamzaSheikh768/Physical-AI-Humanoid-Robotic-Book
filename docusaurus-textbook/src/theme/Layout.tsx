import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import ChatWidget from '../components/chat/ChatWidget';
import { SessionProvider } from '../services/auth/session-context';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps): React.ReactElement {
  return (
    <SessionProvider>
      <OriginalLayout {...props}>
        {props.children}
        <ChatWidget />
      </OriginalLayout>
    </SessionProvider>
  );
}
