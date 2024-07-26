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

// studentShema.pre('save', function (next) {
//   if (this.isNew) {
//     this.studentId = generate10DigitID();
//   }
//   next();
// });
studentShema.pre('save', function (next) {

    this.statusChangedAt = Date.now()
    return next();
})
studentShema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.$set && update.$set.status) {
      this.set({ statusChangedAt: Date.now() });
    }
    next();
  });

export const Student = mongodb.model('Student', studentShema);
