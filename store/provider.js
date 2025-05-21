'use client';

import { Provider } from 'react-redux';
import { makeStore } from './store';

// Create store once in the client
const store = makeStore();

export function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
} 