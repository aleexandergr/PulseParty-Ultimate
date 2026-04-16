import User from '../models/User.js';
import Room from '../models/Room.js';
import Message from '../models/Message.js';

const onlineUsers = new Map();

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('presence:login', async ({ userId }) => {
      if (!userId) return;
      onlineUsers.set(String(userId), socket.id);
      await User.findByIdAndUpdate(userId, { online: true });
      io.emit('presence:update', { userId, online: true });
    });

    socket.on('room:join', async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.data.userId = userId;
      socket.data.roomId = roomId;
      const room = await Room.findById(roomId).populate('participants', 'name avatar countryCode online');
      io.to(roomId).emit('room:presence', room?.participants || []);
    });

    socket.on('room:chat', async (payload) => {
      const message = await Message.create({
        room: payload.roomId,
        from: payload.from,
        type: 'room',
        text: payload.text || '',
        image: payload.image || '',
        gifUrl: payload.gifUrl || '',
      });
      const populated = await message.populate('from', 'name avatar countryCode');
      io.to(payload.roomId).emit('room:chat', populated);
    });

    socket.on('dm:send', async (payload) => {
      const message = await Message.create({
        from: payload.from,
        to: payload.to,
        type: 'direct',
        text: payload.text || '',
        image: payload.image || '',
        gifUrl: payload.gifUrl || '',
      });
      const populated = await message.populate('from to', 'name avatar countryCode');
      const targetSocket = onlineUsers.get(String(payload.to));
      if (targetSocket) io.to(targetSocket).emit('dm:receive', populated);
      socket.emit('dm:receive', populated);
    });

    socket.on('player:sync', async ({ roomId, state, actorId }) => {
      const room = await Room.findById(roomId);
      if (!room) return;
      const isOwner = String(room.owner) === String(actorId);
      if (room.playerLocked && !isOwner) return;
      room.playback = { ...room.playback.toObject(), ...state, updatedAt: new Date() };
      await room.save();
      socket.to(roomId).emit('player:update', room.playback);
    });

    socket.on('webrtc:signal', ({ roomId, target, signal, from }) => {
      io.to(target).emit('webrtc:signal', { signal, from, roomId, socketId: socket.id });
    });

    socket.on('disconnect', async () => {
      const userId = socket.data.userId;
      if (userId) {
        onlineUsers.delete(String(userId));
        await User.findByIdAndUpdate(userId, { online: false });
        io.emit('presence:update', { userId, online: false });
      }
    });
  });
}
