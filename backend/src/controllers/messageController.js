import Message from '../models/Message.js';

export async function getRoomMessages(req, res, next) {
  try {
    const messages = await Message.find({ room: req.params.roomId, type: 'room' })
      .populate('from', 'name avatar countryCode')
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function getDirectMessages(req, res, next) {
  try {
    const userId = req.user._id;
    const otherId = req.params.userId;
    const messages = await Message.find({
      type: 'direct',
      $or: [
        { from: userId, to: otherId },
        { from: otherId, to: userId },
      ],
    })
      .populate('from to', 'name avatar countryCode')
      .sort({ createdAt: 1 })
      .limit(200);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}
