import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

await mongoose.connect(DB);
console.log("DB connected");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "email is registered"],
    validate: [isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  tokenVersion: {
    type: Number,
    default: 1,
  },
});

const tempUser = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    default: "user",
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  otp: {
    type: String,
    required: true,
  },
});

export const TempUser = mongoose.model("tempUser", tempUser);

export const UserData = mongoose.model("userData", userSchema);
