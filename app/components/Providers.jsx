'use client';

import { CookiesProvider } from 'react-cookie';
import { ReduxProvider } from '../../store/provider';

export default function Providers({ children }) {
  return (
    <CookiesProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </CookiesProvider>
  );
} 