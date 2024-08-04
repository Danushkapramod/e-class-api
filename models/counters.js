import mongoose from 'mongoose';

export const counterShema = new mongoose.Schema({
  for: String,
  sequenceValue: { type: Number, default: 1000 },
});


