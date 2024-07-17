import dotenv from 'dotenv'
import mongoose  from 'mongoose'
import { classSchema } from '../models/class.js';
import { teacherShema } from '../models/teacher.js';
import { gradeShema } from '../models/grades.js';
import { hallShema } from '../models/halls.js';
import { subjectShema } from '../models/subjects.js';

dotenv.config()
  export const mongodb = mongoose.createConnection(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

 mongodb.once('open', () => {
      //console.log(`Mongoose connection open`);
  });

//Creating New MongoDb Connection obect by Switching DB
 export const getTenantDB = (tenantId) => {

    const dbName = `user_${tenantId}`;
      // useDb will return new connection
      if (mongodb) {
      const db = mongodb.useDb(dbName);
      //console.log(`DB switched to ${dbName}`);

          db.model("Class", classSchema);
          db.model("Teacher",teacherShema);
          db.model("Grade",gradeShema);
          db.model("Hall",hallShema);
          db.model("Subject",subjectShema);
      return db;
      }
  };
  
  //Return Model as per tenant
  export const getModelByTenant = (tenantId, modelName) => {
    const tenantDb = getTenantDB(tenantId);
    return tenantDb.model(modelName);
  };

