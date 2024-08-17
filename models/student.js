import mongoose from 'mongoose';


export const studentShema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  classId:{type:mongoose.SchemaTypes.ObjectId,require:true},
  name: { type: String, lowercase: true },
  phone: { type: String, unique:false },
  status: {
    type: String,
    default: 'unpaid'
  },
  statusChangedAt: Date,
  createdAt: { type: Date, default: Date.now },
  isVisible:{type:Boolean,default:true},
  hiddenAt:  Date ,
});


studentShema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (update.status){
     update.statusChangedAt = Date.now()
    }
    if (Object.prototype.hasOwnProperty.call(update, 'isVisible')){
     update.hiddenAt = Date.now()
    }
    this.setUpdate(update);
    next(); 
  })

