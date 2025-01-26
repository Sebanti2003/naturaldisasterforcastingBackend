// import nodemailer from "nodemailer";
// import bcrypt from "bcryptjs";
// import { User } from "../models/user.model.js";
// import { configDotenv } from "dotenv";
// configDotenv();
// export const sendEmail = async ({ email, emailType, userid }) => {
//   try {
//     const hashedtoken = await bcrypt.hash(userid.toString(), 10);
//     const encodedtoken = encodeURIComponent(hashedtoken);
//     if (emailType === "VERIFY") {
//       const updateduser = await User.findOneAndUpdate(
//         userid,
//         {
//           $set: {
//             verificationToken: encodedtoken,
//             verificationTokenExpires: Date.now() + 3600000, //1 hour
//           },
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//     } else {
//       const updateduser = await User.findByIdAndUpdate(
//         userid,
//         {
//           $set: {
//             forgotPasswordToken: encodedtoken,
//             forgotPasswordTokenExpires: Date.now() + 3600000, //1 hour
//           },
//         },
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//     }
//     const user = await User.findById(userid);
//     const transporter = nodemailer.createTransport({
//       host: process.env.BREVO_HOST,
//       port: process.env.BREVO_PORT,
//       auth: {
//         user: process.env.BREVO_USER,
//         pass: process.env.BREVO_PASSWORD,
//       },
//     });
//     const resetpasswordmessage = `Hello, \n\nYou are receiving this email because you
//             forgot your password and requested that we email it to you. \n\n
//             If you did not request this, please ignore this email and your password will remain unchanged.\n
//             \n\n
//             Please click on the following link, or paste this into your browser to complete the process:\n\n
//             ${process.env.URL}/reset-password/${userid}?token=${user.forgotPasswordToken}\n\n
//             <a href='${process.env.URL}/reset-password/${userid}?token=${user.forgotPasswordToken}'>${process.env.URL}/reset-password/${userid}?token=${user.forgotPasswordToken}</a>\n
//             Best,\n
//             Your Team`;
//     const verifyemailmessage = `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       line-height: 1.6;
//       color: #333;
//       background-color: #f9f9f9;
//       padding: 0;
//       margin: 0;
//     }
//     .email-container {
//       max-width: 600px;
//       margin: 20px auto;
//       background: #ffffff;
//       border: 1px solid #ddd;
//       border-radius: 8px;
//       padding: 20px;
//       box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//     }
//     .email-header {
//       font-size: 24px;
//       font-weight: bold;
//       margin-bottom: 10px;
//       text-align: center;
//       color: #0073e6;
//     }
//     .email-body {
//       font-size: 16px;
//       line-height: 1.6;
//     }
//     .email-link {
//       display: inline-block;
//       margin: 20px 0;
//       padding: 10px 20px;
//       background-color: #0073e6;
//       color: #ffffff;
//       text-decoration: none;
//       border-radius: 5px;
//     }
//     .email-footer {
//       margin-top: 20px;
//       font-size: 14px;
//       color: #666;
//       text-align: center;
//     }
//   </style>
// </head>
// <body>
//   <div class="email-container">
//     <div class="email-header">Email Verification</div>
//     <div class="email-body">
//       <p>Hello,</p>
//       <p>
//         You are receiving this email because you requested that we verify your email address.
//         If you did not request this, please ignore this email, and your email address will remain unchanged.
//       </p>
//       <p>
//         Please click on the following link, or paste it into your browser to complete the process:
//       </p>
//       <p>
//         <a
//           href="${process.env.URL}/api/v1/user/auth/verify-email/${userid}?token=${user.verificationToken}"
//           class="email-link"
//         >
//           Verify Email
//         </a>
//       </p>
//       <p>
//         Or use this link:
//         <br>
//         ${process.env.URL}/api/v1/user/auth/verify-email/${userid}?token=${user.verificationToken}
//       </p>
//       <p>Best regards,</p>
//       <p>Sebanti & Team</p>
//     </div>
//     <div class="email-footer">
//       &copy; 2024 Sebanti & Team. All rights reserved.
//     </div>
//   </div>
// </body>
// </html>
// `;
//     const normalmessage = `Hello, \n\nYou are receiving this email because you requested that we send
//                           you an email. \n\n

//                           Best,\n
//                           Your Team`;
//     let mailOptions;

//     mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: "Email Sent",
//       text:
//         emailType === "VERIFY"
//           ? verifyemailmessage
//           : emailType === "RESETPASSWORD"
//           ? resetpasswordmessage
//           : normalmessage,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     return info;
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { configDotenv } from "dotenv";
configDotenv();

export const sendEmail = async ({ email, emailType, userid }) => {
  try {
    const hashedToken = await bcrypt.hash(userid.toString(), 10);
    const encodedToken = encodeURIComponent(hashedToken);

    // Update user based on the email type
    if (emailType === "VERIFY") {
      await User.findOneAndUpdate(
        userid,
        {
          $set: {
            verificationToken: encodedToken,
            verificationTokenExpires: Date.now() + 3600000, // 1 hour
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else if (emailType === "RESETPASSWORD") {
      await User.findByIdAndUpdate(
        userid,
        {
          $set: {
            forgotPasswordToken: encodedToken,
            forgotPasswordTokenExpires: Date.now() + 3600000, // 1 hour
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    // Fetch the updated user
    const user = await User.findById(userid);

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: process.env.BREVO_PORT,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASSWORD,
      },
    });

    // Define email messages
    const resetPasswordMessage = `
      <p>Hello,</p>
      <p>You are receiving this email because you forgot your password and requested to reset it.</p>
      <p>Please click the link below or paste it into your browser to reset your password:</p>
      <p>
        <a href="${process.env.URL}/api/v1/user/auth/reset-password/${userid}?token=${user.forgotPasswordToken}">
          Reset Password ${process.env.URL}/api/v1/user/auth/reset-password/${userid}?token=${user.forgotPasswordToken}
        </a>
      </p>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>Best regards,<br>Your Team</p>
    `;

    const verifyEmailMessage = `
      <p>Hello,</p>
      <p>You are receiving this email to verify your email address.</p>
      <p>Please click the link below or paste it into your browser to verify your email:</p>
      <p>
        <a href="${process.env.URL3}/api/v1/user/auth/verify-email/${userid}?token=${user.verificationToken}">
          Verify Email
        </a>
      </p>
      <p>If you did not request this, please ignore this email, and your email address will remain unchanged.</p>
      <p>Best regards,<br>Sebanti & Team</p>
    `;

    const normalMessage = `
      <p>Hello,</p>
      <p>You are receiving this email as a general notification.</p>
      <p>Best regards,<br>Your Team</p>
    `;

    // Select the message based on email type
    let message;
    if (emailType === "VERIFY") {
      message = verifyEmailMessage;
    } else if (emailType === "RESETPASSWORD") {
      message = resetPasswordMessage;
    } else {
      message = normalMessage;
    }

    // Define mail options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify Your Email"
          : emailType === "RESETPASSWORD"
          ? "Reset Your Password"
          : "Notification",
      html: message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(info);

    return info;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
