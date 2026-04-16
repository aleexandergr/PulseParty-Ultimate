import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['room', 'direct'], default: 'room' },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    gifUrl: { type: String, default: '' },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' }
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
