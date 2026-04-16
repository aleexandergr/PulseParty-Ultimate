import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    privacy: { type: String, enum: ['public', 'private'], default: 'public' },
    inviteCode: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    playerLocked: { type: Boolean, default: false },
    content: {
      mode: {
        type: String,
        enum: ['youtube', 'mp4', 'hls', 'external-sync', 'drive-link'],
        default: 'youtube',
      },
      url: { type: String, default: '' },
      title: { type: String, default: '' },
      poster: { type: String, default: '' },
      provider: { type: String, default: '' }
    },
    playback: {
      isPlaying: { type: Boolean, default: false },
      currentTime: { type: Number, default: 0 },
      duration: { type: Number, default: 0 },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
