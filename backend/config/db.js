import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando MongoDB', error.message);
    process.exit(1);
  }
}
