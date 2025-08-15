import { createAccessToken, verifyRefreshToken } from "./jwt.js";

export async function refreshAccess(req, res) {
  const payload = verifyRefreshToken(req);

  if (!payload) {
    return res.status(404).json({ message: "not valid refreshtoken" });
  }
  payload._id = payload.sub;
  await createAccessToken(payload, res);
  res.status(200).json({ message: "refresh access done", fullName: payload.fullName, email: payload.email });
}
