// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "7bcb1537cf8c33",
//     pass: "5dde94ef25d910",
//   },
// });


// export async function sendMail({from,to,subject,text,html}) {
//   // send mail with defined transport object
//   const info = await transporter.sendMail({from, to, subject, text,html,});
//   console.log("Message sent: %s", info.messageId);

// }


import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "edusuit.reply@gmail.com",
    pass: "ysxt ssaq nemi jisd",
  },
});


export async function sendMail({from,to,subject,text,html}) {
  // send mail with defined transport object
  const info = await transporter.sendMail({from, to, subject, text,html,});
  console.log("Message sent: %s", info.messageId);

}
