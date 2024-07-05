import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { s3Client } from "../configs/aws-config.js";

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


