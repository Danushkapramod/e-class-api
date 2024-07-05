import dotenv from 'dotenv'
import { S3Client } from "@aws-sdk/client-s3";

dotenv.config({ path: './configs/config.env' })

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing AWS configuration in environment variables");
}
const clientParams = {
    region,
    credentials: {accessKeyId,secretAccessKey}
}

export const s3Client = new S3Client(clientParams);



 
