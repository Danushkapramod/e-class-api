import { sendMail } from '../configs/email.js'

export class Email{
    constructor({name,url,email,pin}){
        this.name = name;
        this.url = url;
        this.pin = pin;
        this.email = email;
        this.styles = `* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f4f8;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
      }

      .container {
        max-width: 700px;
        color: black;
      }

      .header,
      .footer {
        display: flex;
        text-align: center;
        height: 80px;
        background-color: #334155;
      }

      .header-title,
      .footer-title {
        font-size: 24px;
        margin-top: 26px;
        width: 100%;
        font-weight: 500;
        text-align: center;
        color: #e2e8f0;
      }

      .content {
        padding: 24px;
        font-size: 16px;
        background-color: white;
      }

      .greeting {
        padding-bottom: 16px;
        font-size: 20px;
        font-weight: bold;
      }

      .button-container {
        width: 100%;
        text-align: center;
      }

      .verify-button {
        margin-top: 24px;
        display: inline-block;
        max-width: 240px;
        width: 100%;
        border-radius: 4px;
        background-color: #3b82f6;
        padding: 12px 24px;
        color: #FFFFFF !important;
        border: none;
        cursor: pointer;
        font-size: 16px;
      }
     .verify-pin {
        margin-top: 24px;
        display: inline-block;
        padding: 12px 24px;
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 2px;

      }
      .help-text {
        margin-top: 48px;
      }

      .help-email {
        color: red;
      }

      .closing {
        margin-top: 32px;
      }`
    }

    verify(){
     const message = `${this.name}, thank you for signing up. Please verify your email by clicking the link below:\n\n${this.url}`;   
     const html = `
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>EduSuit Email</title>
         <style>
         ${this.styles}
         </style>
        </head>
     <body>
        <div class="container">
        <div class="header">
            <p class="header-title">EduSuit</p>
        </div>
        <div class="content">
            <p class="greeting">Hi ${this.name}</p>
            <p>Thank you for signing up. Please verify your email by clicking the button below</p>
            <div class="button-container">
            <a href=${this.url} class="verify-button">Verify Email</a>
            </div>
            <p class="help-text">
            If you have any issue confirming your email we will be happy to help you. You can contact
            us on : <span class="help-email">edusuit.reply@gmail.com</span>
            </p>
            <p class="closing">Regards,</p>
            <p>The EduSuit Team</p>
        </div>
        <div class="footer">
            <p class="footer-title"></p>
        </div>
        </div>
        </body>
        </html>`
     
     const mailOptions = {
        from: 'no-reply@yourdomain.com',
        to: this.email,
        subject: 'Verify Your Email',
        text: message,
        html
      };
      sendMail(mailOptions)
    }
    
    emailChangePin(){
        const message = `${this.name}, you requested to change your email address. Your verification PIN is: ${this.pin}`;  
        const html = `
      <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>EduSuit Email</title>
         <style>
         ${this.styles}
         </style>
        </head>
      <body>
        <div class="container">
        <div class="header">
            <p class="header-title">EduSuit</p>
        </div>
        <div class="content">
            <p class="greeting">Hi ${this.name}</p>
            <p>You requested to change your email address. Your verification PIN is:</p>
            <div class="button-container">
            <div class="verify-pin">${this.pin}</div>
            </div>
            <p class="help-text">
            If you have any issue changing your email we will be happy to help you. You can contact
            us on : <span class="help-email">edusuit.reply@gmail.com</span>
            </p>
            <p class="closing">Regards,</p>
            <p>The EduSuit Team</p>
        </div>
        <div class="footer">
            <p class="footer-title"></p>
        </div>
        </div>
        </body>
        </html>`

        const mailOptions = {
            from: 'no-reply@yourdomain.com',
            to: this.email,
            subject: 'Email Change Verification PIN',
            text: message,
            html
          };
          sendMail(mailOptions)
    }

    passwordResetToken(){
      const message = `${this.name} you requested a password reset. Please make a PUT request to: \n\n ${this.url}`;
       const html =`
       <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>EduSuit Email</title>
         <style>
         ${this.styles}
         </style>
        </head>
       <body>
        <div class="container">
        <div class="header">
            <p class="header-title">EduSuit</p>
        </div>
        <div class="content">
            <p class="greeting">Hi ${this.name}</p>
            <p>You requested a password reset. Please click the button below to reset your password</p>
            <div class="button-container">
             <a href=${this.url} class="verify-button">Reset Password</a>
            </div>
            <p class="help-text">
            If you have any issue changing your email we will be happy to help you. You can contact
            us on : <span class="help-email">edusuit.reply@gmail.com</span>
            </p>
            <p class="closing">Regards,</p>
            <p>The EduSuit Team</p>
        </div>
        <div class="footer">
            <p class="footer-title"></p>
        </div>
        </div>
        </body>
        </html>`
       
        const mailOptions = {
            from: 'no-reply@yourdomain.com',
            to: this.email,
            subject: 'Password Reset',
            text: message,
            html
          };
          sendMail(mailOptions)
      }  

}