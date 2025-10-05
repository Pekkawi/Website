// This is a socketio webserver. It is used in the Nodes Page to stream the data from the different machines on the website
// for more information on how this was implemented check: https://socket.io/how-to/use-with-nextjs
//

import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost'; // IMPORTANT: Use 0.0.0.0 for Docker
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://10.126.128.51:3000',
        'http://localhost:3000',
        'http://0.0.0.0:3000',
      ],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('👤 New client connected:', socket.id);

    // 1) Forward any "printerStatus" from any client (Python or front-end)
    socket.on('printerStatus', (payload) => {
      // Re-broadcast to *all* connected clients (browsers, Python, etc.)
      console.log('A message has been received');
      io.emit('printerStatus', payload);
    });

    socket.on('updateHistory', async (payload) => {
      const nodeId = payload._id;

      const res = await fetch(`http://${hostname}:${port}/api/nodes/${nodeId}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printTime: payload.printTime,
          fileName: payload.fileName,
          name: payload.name,
        }),
      });
      if (!res.ok) {
        console.error(`Failed to update history: ${res.status}`);
      }
    });

    // … your existing handlers …
    socket.on('message', (data) => {
      io.emit('message', {
        text: data.text,
        userId: socket.id,
        timestamp: new Date().toISOString(),
        username: data.username,
      });
    });

    socket.on('disconnect', () => {
      console.log('⚠️ Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
