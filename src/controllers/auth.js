export const authController = {
  async authenticateUser(req, res) {
    const { accessToken, refreshToken } = req.user;
    delete req.user.accessToken;
    delete req.user.refreshToken;
    const user = JSON.parse(JSON.stringify(req.user));
    const cleanUser = Object.assign({}, user);
    delete cleanUser.password;
    res
      .cookie("accessToken", `Bearer ${accessToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 30,
      })
      .cookie("refreshToken", `Bearer ${refreshToken}`, {
        httponly: true,
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({ user: cleanUser });
  },

  async logout(req, res) {
    if (req.user) {
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.json({ message: "User Logged Out Successfully" });
    } else {
      return res.json({ msg: "Please login first!" });
    }
  },
};
