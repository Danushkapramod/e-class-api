import mongoose from 'mongoose';
import { mongodb } from '../configs/database.js';
import { generate10DigitID } from '../utils/random.Genarates.js';

const studentShema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: { type: String, lowercase: true },
  phone: { type: String, unique: true },
  status: {
    type: String,
    enum: ['half', 'paid', 'unpaid', 'free'],
    default: 'unpaid'
  },
  statusChangedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

studentShema.pre('save', function (next) {
  if (this.isNew) {
    this.studentId = generate10DigitID();
  }
  next();
});

studentShema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    
    if (update.status){
    update.statusChangedAt = Date.now()
    this.setUpdate(update);
    }
    next(); 
  })
export const Student = mongodb.model('Student', studentShema);
