import { createAccessToken, verifyRefreshToken } from "./jwt.js";

export async function refreshAccess(req, res) {
  const payload = verifyRefreshToken(req);

  if (!payload) {
    return res.send({ message: "not valid refreshtoken" });
  }
  payload._id = payload.sub;
  createAccessToken(payload, res);
  res.send({ message: "refresh access done", fullName: payload.fullName, email: payload.email });
}
