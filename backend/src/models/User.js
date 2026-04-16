import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    backgroundType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
    backgroundUrl: { type: String, default: '' },
    countryCode: { type: String, default: 'UN' },
    countryName: { type: String, default: 'Unknown' },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    online: { type: Boolean, default: false },
    resetToken: { type: String, default: '' },
    resetTokenExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
