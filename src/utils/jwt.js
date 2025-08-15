import fs from "fs";
import jwt from "jsonwebtoken";

// Create refresh token
export function createRefreshToken(user, res) {
  const payload = {
    sub: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    tokenVersion: user.tokenVersion,
  };
  const privateKey = process.env.PRIVATE_KEY;

  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
    issuer: "shrinkify-app",
    audience: "shrinkify-users",
    jwtid: `jwt-${Date.now()}`,
  });

  res.cookie("refreshtoken", token, {
    httpOnly: true,
    secure: true, // ✅ Required for HTTPS
    sameSite: "None", // ✅ Allows cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// Create access token
export function createAccessToken(user, res) {
  const payload = { sub: user._id, email: user.email, role: user.role };
  const privateKey = process.env.PUBLIC_KEY;

  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "10m", // 10 minutes
    issuer: "shrinkify-app",
    audience: "shrinkify-users",
    jwtid: `jwt-${Date.now()}`,
  });

  res.cookie("accesstoken", token, {
    httpOnly: true,
    secure: true, // ✅ Required for HTTPS
    sameSite: "None", // ✅ Allows cross-site cookies
    maxAge: 10 * 60 * 1000,
  });
}

// Verify refresh token
export function verifyRefreshToken(req) {
  const publicKey = fs.readFileSync("./keys/public.key");
  const token = req.cookies.refreshtoken;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "shrinkify-app",

      audience: "shrinkify-users",
      maxAge: "7d",
      clockTolerance: 5,
    });
    console.log("done");
    return decoded; // Return payload for DB lookup
  } catch {
    console.log("done344");
    return null;
  }
}

// Verify access token
export function verifyAccessToken(req) {
  const publicKey = fs.readFileSync("./keys/public.key");
  const token = req.cookies.accesstoken;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "shrinkify-app",
      audience: "shrinkify-users",
      maxAge: "10m",
      clockTolerance: 5,
    });
    return decoded;
  } catch {
    return null;
  }
}
