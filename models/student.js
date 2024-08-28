import mongoose from 'mongoose';


export const studentShema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  class:[
    {
      _id: false,
      classId:{type:String,require:true} ,
      status: {type: String,default: 'unpaid'},
      joinedAt:Date
    }
  ],
  name: { type: String, lowercase: true },
  phone: { type: String, unique:false },
  statusChangedAt: Date,
  createdAt: { type: Date, default: Date.now },
  isVisible:{type:Boolean,default:true},
  hiddenAt:  Date 
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

