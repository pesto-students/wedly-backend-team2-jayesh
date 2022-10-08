/* eslint-disable no-unused-vars */
import { CLIENT_APP_URL } from "../../config/index.js";

/* eslint-disable no-console */
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

  async authState(req, res) {
    if (req.isAuthenticated()) {
      return res.status(200).json({
        flag: true,
        user: req.user,
      });
    }
    return res.status(200).json({
      flag: false,
      user: null,
    });
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

  async authenticateGoogleUser(req, res) {
    const { accessToken, refreshToken } = req.user;
    delete req.user.accessToken;
    delete req.user.refreshToken;
    const user = JSON.parse(JSON.stringify(req.user));
    const cleanUser = Object.assign({}, user);
    // delete cleanUser.password;
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
      });
    res.redirect(CLIENT_APP_URL);
  },

  async logoutGoogleUser(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.redirect(CLIENT_APP_URL);
    });
  },
};
