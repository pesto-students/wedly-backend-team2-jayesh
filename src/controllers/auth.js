export const authController = {
  async authenticate(req, res) {
    const { accessToken, refreshToken } = req.user;
    delete req.user.accessToken;
    delete req.user.refreshToken;
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
        maxAge: 1000 * 60 * 30,
      })
      .header("Access-Control-Allow-Credentials", true)
      .header("Origin-Allow-Credentials", true)
      .json({ data: req.user });
  },
  async logout(req, res) {
    try {
      res
        .status(200)
        .cookie("accessToken", ``, {
          httponly: true,
          sameSite: "none",
          secure: true,
        })
        .cookie("refreshToken", ``, {
          httponly: true,
          sameSite: "none",
          secure: true,
        })
        .json({ message: "Logged out successfully" });
      // res.redirect("http://localhost:3000");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  },
};
