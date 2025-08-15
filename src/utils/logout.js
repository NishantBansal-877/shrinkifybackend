export function logout(req, res) {
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 0,
  });
  res.clearCookie("accesstoken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 0,
  });
  res.end({message:"logout"});
}
export default logout;
