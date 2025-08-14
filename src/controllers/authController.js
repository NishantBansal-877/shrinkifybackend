import { TempUser, UserData } from "../config/mongoose.js";
import { sendOtpToEmail } from "../services/mailService.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import isEmail from "validator/lib/isEmail.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email) {
    res.end("please provide email.");
  }

  if (!password) {
    res.end("please provide password.");
  }

  if (!isEmail(email)) {
    return res.end("Invalid email format");
  }

  let user = await UserData.findOne({ email: email });
  if (!user) {
    res.end("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    createRefreshToken(user, res);
    createAccessToken(user, res);

    res.send({
      message: "login successful",
      fullName: user.fullName,
      email: user.email,
    });
  } else {
    return res.end("Incorrect password");
  }
}

export async function signUp(req, res) {
  const { fullName, email, password } = req.body;
  const exist = await UserData.findOne({ email: email });
  if (exist) {
    res.end("already exist");
  } else {
    try {
      if (!isEmail(email)) {
        return res.end("Invalid email format");
      }
      if (password.length < 8) {
        return res.end("Password must be at least 8 characters");
      }
      const otp = await sendOtpToEmail(email);
      if (!otp) {
        res.end("something wrong please try again later!!!");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await TempUser.create({ fullName, email, password: hashedPassword, otp });

      res.end("send otp to your email");
    } catch (err) {
      res.status(400).json({ error: err.message || "Something went wrong" });
    }
  }
}

export async function otpVerification(req, res) {
  const { email, otp, message } = req.body;
  try {
    const user = await TempUser.findOne({ email, otp });

    if (!user) {
      return res.status(401).send("Invalid email or OTP expired");
    }
    if (message === "otpVerify") {
      await UserData.create({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: "user",
        tokenVersion: 1,
      });

      await TempUser.deleteMany({ email });

      res.end("signup successful");
    } else {
      await UserData.updateOne(
        {
          email: user.email,
        },
        { password: user.password }
      );

      await TempUser.deleteMany({ email });

      res.end("new password created");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
}

export async function forgetPassword(req, res) {
  const { email, password } = req.body;

  if (!isEmail(email)) {
    return res.status(404).json({ message: "Invalid email format" });
  }

  let user = await UserData.findOne({ email: email });
  if (!user) {
    res.send({ message: "user not found" });
    res.end();
  }

  const otp = await sendOtpToEmail(email);
  if (!otp) {
    res.end("something wrong please try again later!!!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await TempUser.create({ email, password: hashedPassword, otp });

  res.status(200).json({ message: "forget otp sent" });
}
