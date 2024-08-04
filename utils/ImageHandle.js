import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import Jimp from "jimp";
import { s3Client } from "../configs/aws-config.js";
import QRCode from 'qrcode';
import sharp from "sharp";


const _bucket = "aws-bucket-e-class";
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

  async uploadBuffer(fileName, bucket,stream) {
    if(fileName && bucket && stream){
    try {
      const putObjectParams = {
          Bucket: bucket,
          Body: stream, 
          Key:fileName,
          ContentType: 'image/webp'  
      }
      const result =  await this.s3Client.send( new PutObjectCommand(putObjectParams));
      return result

    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
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


export async function qrGenarateUpload(fileName,bucket,qrData,qrLabel){
if(fileName && bucket && qrData){
try {
 const qrCodeBuffer = await QRCode.toBuffer(qrData,{scale:18});
 const jimpImage = await Jimp.read(qrCodeBuffer);
 const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
 jimpImage.print(font, 70, 16, `ID: ${qrLabel}`);
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
}
};


export async function qrGenarateSave(fileName,qrData,qrLabel){
if(fileName && qrData) { 
try {
 const qrCodeBuffer = await QRCode.toBuffer(qrData,{scale:18});
 const jimpImage = await Jimp.read(qrCodeBuffer);
 const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
 jimpImage.print(font, 70, 16, `ID: ${qrLabel}`);
 const retult =  await jimpImage.writeAsync(fileName)
 return retult

  } catch (err) {
    console.error('Error uploading to S3:', err);
    throw err;
  }
}
};

export async function uploadBuffer({fileName, bucket = _bucket,buffer}) {
  if(fileName && bucket && bucket){
  try {
    if(fileName && bucket && bucket){
      const putObjectParams = {
          Bucket: bucket,
          Body: buffer, 
          Key:fileName,
          ContentType:'image/webp'
      }
      const result =  await s3Client.send( new PutObjectCommand(putObjectParams));
      return result
    }
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  } 
}
}

export async function s3deleteFile({fileName, bucket = _bucket}) {
  if(fileName && bucket){
  try {
    const params = {
      Bucket: bucket,
      Key:fileName,
    };
    const command = new DeleteObjectCommand(params);
    const result =  await s3Client.send(command);
    return result

  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
}
}

export async function updateBuffer({fileUrl,fileName, bucket = _bucket,buffer}) {
  try {
    if(fileUrl &&  bucket){
      const oldFileName = fileUrl.split("amazonaws.com/")[1] 
      s3deleteFile({fileName:oldFileName})
    }
    if(fileName && bucket && bucket){
      const putObjectParams = {
          Bucket: bucket,
          Body: buffer, 
          Key:fileName,
          ContentType:'image/webp'
      }
      const result =  await s3Client.send( new PutObjectCommand(putObjectParams));
      return result
  }
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

export async function resizeImage({buffer,width,height}){
  if(buffer){
    try {
      const resizedBuffer = await sharp(buffer)
        .resize(width, height)
        .toBuffer();
      return resizedBuffer;

    } catch (error) {
      console.error('Error resizing image buffer:', error);
      throw error;
    }
  }
}