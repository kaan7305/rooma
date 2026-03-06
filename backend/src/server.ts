import http from 'http';
import app from './app';
import config from './config/env';
import { Server as SocketServer } from 'socket.io';
import { initializeSocket } from './socket';

const PORT = config.port;

// Create HTTP server from Express app (needed for Socket.io)
const server = http.createServer(app);

// Initialize Socket.io if enabled
let io: SocketServer | undefined;
if (config.features.websocket) {
  io = initializeSocket(server);
  console.log('WebSocket server initialized');
}

server.listen(PORT, () => {
  console.log('=================================');
  console.log(`ROOMA API Server`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`WebSocket: ${config.features.websocket ? 'enabled' : 'disabled'}`);
  console.log('=================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (io) io.close();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  if (io) io.close();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { io };
export default server;
