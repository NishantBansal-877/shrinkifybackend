export function logout(req, res) {
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
  });
  res.clearCookie("accesstoken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
  });
  res.send("logout");
}
export default logout;
