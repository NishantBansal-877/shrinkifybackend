import { createAccessToken, verifyRefreshToken } from "./jwt.js";

export async function refreshAccess(req, res) {
  const payload = verifyRefreshToken(req);
console.log(payload);
  if (!payload) {
    return res.status(404).json({ message: "not valid refreshtoken" });
  }
  payload._id = payload.sub;
  createAccessToken(payload, res);
  res.status(200).json({ message: "refresh access done", fullName: payload.fullName, email: payload.email });
}
