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


 //import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail", // <-- easier than setting host/port manually
//   auth: {
//     user: "edusuit.reply@gmail.com",
//     pass: "jrsf ijjs rayj pjjh", 
//   },
// });


//import postmark from "postmark";
import axios from "axios";

const BREVO_API_KEY = "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";



export async function sendMail({to,subject,text,html,attachments}) {
  try {
    const response = await axios.post(
      "https://api.sendinblue.com/v3/smtp/email",
      {
        sender: {
          email: "edusuit@edusuit.online", name: "EduSuit",
        },
        to: [
          { email: to,},
        ],
        subject,
        textContent: text,
        htmlContent: html,
        attachment: attachments,
       inlineImageActivation: true,
        headers: {
          "X-Mailin-custom":
            "custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3",
          charset: "iso-8859-1",
        },
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": BREVO_API_KEY,
        },
      }
    );

    console.log("Email sent:", response.data);
  } catch (err) {
    console.error("Error sending email:", err.response?.data || err.message);
  }
  // send mail with defined transport object
  //
// Prepare the email content

  //const info = await transporter.sendMail({from, to, subject, text,html,attachments});
  //console.log("Message sent: %s", info.messageId);
// Send email


}
