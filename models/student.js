import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';
import { mongodb } from '../configs/database.js';

const AutoIncrement = mongooseSequence(mongodb);

const studentShema = new mongoose.Schema({
  studentId: { type: Number, unique: true },
  name: { type: String, lowercase: true },
  phone: { type: String, },
  status: {
    type: String,
    enum: ['half', 'paid', 'unpaid', 'free'],
    default: 'unpaid'
  },
  statusChangedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

studentShema.plugin(AutoIncrement, {
   inc_field: 'studentId', 
   start_seq: 1000
  });


studentShema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (update.status){
    update.statusChangedAt = Date.now()
    this.setUpdate(update);
    }
    next(); 
  })


export const Student = mongodb.model('Student', studentShema);
