import { google } from "googleapis";


 export const oauth2Client = new google.auth.OAuth2(
    '89181791749-i81vabbfv9pk58u2o25l5itu7jpke2j2.apps.googleusercontent.com',
    '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',
     'http://localhost:5173/app/backups'
  );
  
export const setDriveCredentials = async(access_token,refresh_token)=>{
   oauth2Client.setCredentials({access_token,refresh_token});
}

 


 export const drive = google.drive({ version: 'v3', auth: oauth2Client });
  