import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import Jimp from "jimp";
import { s3Client } from "../configs/aws-config.js";
import QRCode from 'qrcode';

export class ImageHandle {
  constructor() {
    this.s3Client = s3Client
  }

  async upload(fileName, bucket) {
    try {
      const putObjectParams = {
          Bucket: bucket,
          Key: fileName,
          ContentType: 'image/jpeg'  
          
      }
      const command = new PutObjectCommand(putObjectParams);
      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

      return signedUrl;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  }


  async delete(fileName, bucket) {
    try {
      const params = {
        Bucket: bucket,
        Key:fileName,
      };

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

    } catch (error) {
      console.error("Error deleting file from S3:", error);
      throw error;
    }
  }
}


export async function qrGenarateUpload(fileName,bucket,qrData){
  try {
 const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData),{scale:18});
 const jimpImage = await Jimp.read(qrCodeBuffer);
 const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
 jimpImage.print(font, 70, 16, `ID: ${qrData}`);
 const toBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

 const params = {
   Bucket: bucket,
   Key: fileName,
   Body: toBuffer,
   ContentType: 'image/png'
 };
 const results = await s3Client.send(new PutObjectCommand(params));

 return results;
  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw err;
  }
};


export async function qrGenarateSave(fileName,qrData){
  try {
 const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData),{scale:18});
 const jimpImage = await Jimp.read(qrCodeBuffer);
 const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
 jimpImage.print(font, 70, 16, `ID: ${qrData}`);
 const retult =  await jimpImage.writeAsync(fileName)
 return retult

  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw err;
  }
};