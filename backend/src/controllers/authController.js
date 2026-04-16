import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendResetEmail } from '../utils/mail.js';
import { getGeoByIp } from '../utils/geo.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '8.8.8.8').split(',')[0].trim();
    const geo = await getGeoByIp(ip);
    const user = await User.create({ name, email, password: hash, ...geo });
    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });
    user.online = true;
    await user.save();
    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json(req.user);
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'Si el correo existe, recibirás instrucciones.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 30);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    await sendResetEmail(user.email, resetUrl);
    res.json({ message: 'Si el correo existe, recibirás instrucciones.', devResetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Token inválido o expirado' });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = '';
    user.resetTokenExpiresAt = null;
    await user.save();
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: 'La contraseña actual no es correcta' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Contraseña actualizada' });
  } catch (error) {
    next(error);
  }
}
