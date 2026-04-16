import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, _res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    const err = new Error('No autorizado');
    err.status = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      const err = new Error('Usuario no encontrado');
      err.status = 401;
      return next(err);
    }
    next();
  } catch {
    const err = new Error('Token inválido');
    err.status = 401;
    next(err);
  }
}
