import { v4 as uuid } from 'uuid';
import Room from '../models/Room.js';

export async function createRoom(req, res, next) {
  try {
    const room = await Room.create({
      name: req.body.name,
      description: req.body.description || '',
      privacy: req.body.privacy || 'public',
      owner: req.user._id,
      participants: [req.user._id],
      inviteCode: uuid().slice(0, 8),
      content: req.body.content || {},
    });
    const populated = await room.populate('owner participants', 'name avatar countryCode online');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
}

export async function listRooms(_req, res, next) {
  try {
    const rooms = await Room.find({ privacy: 'public' })
      .populate('owner participants', 'name avatar countryCode online')
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(rooms);
  } catch (error) {
    next(error);
  }
}

export async function getRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id).populate('owner participants', 'name avatar countryCode online');
    if (!room) return res.status(404).json({ message: 'Sala no encontrada' });
    res.json(room);
  } catch (error) {
    next(error);
  }
}

export async function joinRoom(req, res, next) {
  try {
    const room = await Room.findOne({ inviteCode: req.body.inviteCode }).populate('owner participants', 'name avatar countryCode online');
    if (!room) return res.status(404).json({ message: 'Código inválido' });
    if (!room.participants.some((p) => String(p._id || p) === String(req.user._id))) {
      room.participants.push(req.user._id);
      await room.save();
    }
    res.json(room);
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Sala no encontrada' });
    if (String(room.owner) !== String(req.user._id)) return res.status(403).json({ message: 'Solo el creador puede editar la sala' });

    Object.assign(room, {
      name: req.body.name ?? room.name,
      description: req.body.description ?? room.description,
      privacy: req.body.privacy ?? room.privacy,
      playerLocked: req.body.playerLocked ?? room.playerLocked,
    });

    if (req.body.content) {
      room.content = { ...room.content.toObject(), ...req.body.content };
    }

    await room.save();
    res.json(await room.populate('owner participants', 'name avatar countryCode online'));
  } catch (error) {
    next(error);
  }
}

export async function kickParticipant(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Sala no encontrada' });
    if (String(room.owner) !== String(req.user._id)) return res.status(403).json({ message: 'Solo el creador puede expulsar' });
    room.participants = room.participants.filter((id) => String(id) !== req.params.userId);
    await room.save();
    res.json({ message: 'Usuario expulsado' });
  } catch (error) {
    next(error);
  }
}
