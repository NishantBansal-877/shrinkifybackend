import { createAccessToken, verifyRefreshToken } from "./jwt.js";

export async function refreshAccess(req, res) {
  const payload = verifyRefreshToken(req);

  if (!payload) {
    return res.status(404).json({ message: "not valid refreshtoken" });
  }

  // Fetch fresh user data from DB
  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  createAccessToken(user, res);
  res.status(200).json({
    message: "refresh access done",
    fullName: user.fullName,
    email: user.email
  });
}
