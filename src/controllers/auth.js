/* eslint-disable no-unused-vars */
import { CLIENT_APP_URL } from "../../config/index.js";
import { Host } from "../models/Host.js";
import * as Sentry from "@sentry/node";
import bcrypt from "bcrypt";
import hashPassword from "../utils/hashPassword.js";

/* eslint-disable no-console */
export const authController = {
  async verifyEmail(req, res) {
    try {
      const data = await Host.findById(req.query.id);
      if (req.query.hashedString === data.local.password) {
        await Host.findByIdAndUpdate(
          req.query.id,
          { isVerified: true },
          { new: true },
        );
        res.status(302).redirect(CLIENT_APP_URL + "?success=true");
      } else {
        res.status(422).redirect(CLIENT_APP_URL + "?success=false&errorCode=2");
      }
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).redirect(CLIENT_APP_URL + "?success=false&errorCode=1");
    }
  },
  async authenticateUser(req, res) {
    if (!req.user.message) {
      const { accessToken, refreshToken } = req.user;
      delete req.user.accessToken;
      delete req.user.refreshToken;
      const user = JSON.parse(JSON.stringify(req.user));
      const cleanUser = Object.assign({}, user);
      delete cleanUser.password;
      res.status(200).json({ user: cleanUser, accessToken, refreshToken });
    } else {
      res.status(401).json({ message: req.user.message });
    }
  },

  async authState(req, res) {
    if (req.isAuthenticated()) {
      return res.status(200).json({
        flag: true,
        user: req.user,
        cookies: req.cookies,
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
      // res.clearCookie("accessToken");
      // res.clearCookie("refreshToken");
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
    delete cleanUser.password;
    // res
    //   .cookie("accessToken", `Bearer ${accessToken}`, {
    //     httponly: true,
    //     sameSite: "none",
    //     secure: true,
    //     maxAge: 1000 * 60 * 30,
    //   })
    //   .cookie("refreshToken", `Bearer ${refreshToken}`, {
    //     httponly: true,
    //     sameSite: "none",
    //     secure: true,
    //     maxAge: 1000 * 60 * 60 * 24,
    //   });
    res.redirect(`${CLIENT_APP_URL}?accessToken=${accessToken}`);
  },

  async logoutGoogleUser(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.destroy();
      res.clearCookie("connect.sid");
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
      res.redirect(CLIENT_APP_URL);
    });
  },

  async updateUser(req, res) {
    if (req.user) {
      const { email, updatedName, oldPassword, newPassword } = req.body;
      try {
        const user = await Host.find({ email });
        const updateObj = {};
        updateObj["name"] = updatedName;
        if (oldPassword !== "") {
          if (await bcrypt.compare(oldPassword, user[0].local.password)) {
            updateObj["local.password"] = await hashPassword(newPassword);
          } else {
            return res
              .status(401)
              .json({ message: "Wrong existing password provided" });
          }
        }
        const updatedUser = await Host.findOneAndUpdate(
          { email: email },
          updateObj,
          { new: true },
        );
        res
          .status(200)
          .json({ message: "User updated successfully", updatedUser });
      } catch (err) {
        res.status(500).json({ message: "Something went wrong!" });
      }
    } else {
      res
        .status(401)
        .json({ message: "Please login first to edit user details" });
    }
  },
};
