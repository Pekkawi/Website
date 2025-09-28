'use client';

import { io } from 'socket.io-client';

// CRITICAL: Don't hardcode IPs!

export const socket = io('', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});
