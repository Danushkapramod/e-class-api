import { google } from "googleapis";


const oauth2Client = new google.auth.OAuth2(
    '89181791749-i81vabbfv9pk58u2o25l5itu7jpke2j2.apps.googleusercontent.com',
    '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',
     'http://localhost:5173/app/backups'
  );
  
  oauth2Client.setCredentials({
    access_token: 'ya29.a0AcM612ziK8grMskr9hpt5jHnlfAh1lFQV82PKSorYZbrfUSxk_-kBwXpr4I772RK-fjr6bPTwk0NHx7oPBlCEqmQ12xRM1ZJZbDA7OqilLDICigJH5JV5uBPHAUnw2U0AwKa4ANL80lqKB1O-lcRUp7o_ShKdjeQQyGYpPPzaCgYKAUUSARISFQHGX2MibzAbfdch8o5Si32LbfNm0A0175',
    refresh_token: '1//0gArd1ycdZFIHCgYIARAAGBASNgF-L9Irjzl9HAVPzwATV8T07WgLI1hxCdAomBMGVMMuwUojR0uPz-S-nL-JcNX_8brPn3gMnw'
  });
  
 export const drive = google.drive({ version: 'v3', auth: oauth2Client });
  