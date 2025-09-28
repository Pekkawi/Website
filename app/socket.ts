'use client';

import { io } from 'socket.io-client';

// CRITICAL: Don't hardcode IPs!
const getSocketURL = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  // In production/Docker: use current origin
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  }

  // In development: use localhost
  return 'http://localhost:3000';
};

export const socket = io(getSocketURL(), {
  path: '/socket.io/',
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
