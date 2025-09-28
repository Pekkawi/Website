'use client';

import { io } from 'socket.io-client';

export const socket = io('http://0.0.0.0:3000', {
  transports: ['websocket', 'polling'],
});
