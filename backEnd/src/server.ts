import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import connectDB from './db/config/db';
import dotenv from 'dotenv';
import { initSocketServer } from './socket/socket';
dotenv.config();

const PORT = process.env.PORT;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

connectDB();

initSocketServer(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
