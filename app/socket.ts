'use client';

import { io } from 'socket.io-client';

export const socket = io('http://10.126.128.117:3000', {
  transports: ['websocket', 'polling'],
});
