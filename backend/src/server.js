import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import connectDB from '../config/db.js';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './socket/index.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:3000'],
    credentials: true,
  },
});

app.set('io', io);
registerSocketHandlers(io);

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`PulseParty API on http://localhost:${PORT}`);
  });
});
