import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import { TempUser } from "../config/mongoose.js";

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "<riskyboybutgol@gmail.com>",
      to: email,
      subject: title,
      html: body,
    });
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export async function sendOtpToEmail(userEmail) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const emailTitle = "Your OTP for Verification";
  const emailBody = `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong>. This OTP is valid for a short period.</p>`;

  try {
    await mailSender(userEmail, emailTitle, emailBody);
    setTimeout(
      () => clearOtp(userEmail, otp),
      process.env.OTP_TIMEOUT * 60 * 1000
    );
    return otp;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return null;
    // throw new Error("Could not send OTP email.");
  }
}

async function clearOtp(userEmail, otp) {
  await TempUser.findOneAndDelete({ email: userEmail, otp: otp });
}
