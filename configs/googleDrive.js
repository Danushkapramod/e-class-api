import { google } from "googleapis";


 export const oauth2Client = new google.auth.OAuth2(
    '89181791749-i81vabbfv9pk58u2o25l5itu7jpke2j2.apps.googleusercontent.com',
    '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',
     'http://localhost:5173/app/backups'
  );
  
  oauth2Client.setCredentials({
    refresh_token: '1//0gVSM8uQKR8CBCgYIARAAGBASNgF-L9IrgFnpF-d1yldFnFxUK1d9YYkS-X39RHlCxrvEGpPp5xwUc5UfEDd10XlaE3BMcenuGQ'
  });


 export const drive = google.drive({ version: 'v3', auth: oauth2Client });
  