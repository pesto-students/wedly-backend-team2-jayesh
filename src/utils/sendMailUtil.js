/* eslint-disable no-console */
import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  CLIENT_EMAIL,
  REDIRECT_URI,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  EMAIL_REFRESH_TOKEN,
} from "../../config/index.js";

export async function sendMail(email, subject, text, link) {
  const OAuth2Client = new google.auth.OAuth2(
    EMAIL_CLIENT_ID,
    EMAIL_CLIENT_SECRET,
    REDIRECT_URI,
  );
  OAuth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });
  try {
    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();

    // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: CLIENT_EMAIL,
        clientId: EMAIL_CLIENT_ID,
        clientSecret: EMAIL_CLIENT_SECRET,
        refreshToken: EMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // Create the email options and body
    const mailOptions = {
      from: CLIENT_EMAIL,
      to: email,
      subject: subject,
      text: text,
      html: `Follow this link to verify your email account - ${link}`,
      // attachments: [
      //   {
      //     filename: `${name}.pdf`,
      //     path: path.join(__dirname, `e-books-path/${name}.pdf`),
      //     contentType: "application/pdf",
      //   },
      // ],
    };

    // Set up the email options and delivering it
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}
