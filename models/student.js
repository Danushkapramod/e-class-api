import mongoose from 'mongoose';


export const studentShema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  classId:{type:mongoose.SchemaTypes.ObjectId,require:true},
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


studentShema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (update.status){
    update.statusChangedAt = Date.now()
    this.setUpdate(update);
    }
    next(); 
  })


