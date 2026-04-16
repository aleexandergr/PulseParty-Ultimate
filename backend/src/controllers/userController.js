import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

export const upload = multer({ storage });

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.name) user.name = req.body.name;
    if (req.body.avatar) user.avatar = req.body.avatar;
    if (req.body.backgroundType) user.backgroundType = req.body.backgroundType;
    if (req.body.backgroundUrl) user.backgroundUrl = req.body.backgroundUrl;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function uploadBackground(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Archivo requerido' });
    const type = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const relativeUrl = `/uploads/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.backgroundType = type;
    user.backgroundUrl = relativeUrl;
    await user.save();
    res.json({ backgroundType: type, backgroundUrl: relativeUrl, user });
  } catch (error) {
    next(error);
  }
}

export async function searchUsers(req, res, next) {
  try {
    const q = req.query.q || '';
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }],
    }).select('name email avatar countryCode online');
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function sendFriendRequest(req, res, next) {
  try {
    const existing = await FriendRequest.findOne({ from: req.user._id, to: req.body.to, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Solicitud ya enviada' });
    const request = await FriendRequest.create({ from: req.user._id, to: req.body.to });
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
}

export async function respondFriendRequest(req, res, next) {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Solicitud no encontrada' });
    if (String(request.to) !== String(req.user._id)) return res.status(403).json({ message: 'No autorizado' });
    request.status = req.body.status;
    await request.save();
    if (req.body.status === 'accepted') {
      await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
      await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
}

export async function getSocialGraph(req, res, next) {
  try {
    const me = await User.findById(req.user._id).populate('friends', 'name avatar countryCode online');
    const pending = await FriendRequest.find({ to: req.user._id, status: 'pending' }).populate('from', 'name avatar countryCode online');
    res.json({ friends: me.friends, pending });
  } catch (error) {
    next(error);
  }
}
