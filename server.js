// This is a socketio webserver. It is used in the Nodes Page to stream the data from the different machines on the website
// for more information on how this was implemented check: https://socket.io/how-to/use-with-nextjs
//

import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
console.log('App is here');
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: dev ? ['http://localhost:3000'] : ['https://thecore.sdu.dk'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, nextFn) => {
    const token = socket.handshake.auth?.token;

    if (!token) return nextFn(new Error('missing token'));

    // Allow printer nodes:
    const printerKey = process.env.API_KEY_PRINTERS;

    // Choose your policy:
    if (token !== printerKey) return nextFn(new Error('unauthorized'));

    return nextFn();
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('printerStatus', (payload) => {
      io.emit('printerStatus', payload);
    });

    // IMPORTANT: match the Python event name
    socket.on('updateNodeHistory', async (payload) => {
      try {
        const nodeId = payload._id;

        const res = await fetch(
          `http://127.0.0.1:${port}/api/iot/nodes/${nodeId}/history`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Authorization: `Bearer ${process.env.API_KEY_PRINTERS}`,
            },
            body: JSON.stringify({
              printTime: payload.printTime,
              fileName: payload.fileName,
              name: payload.name,
              card_id: payload.card_id,
            }),
          }
        );

        if (!res.ok) console.error(`Failed to update history: ${res.status}`);
      } catch (e) {
        console.error('updateNodeHistory handler failed:', e);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
