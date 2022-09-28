import { Host } from "../models/Host.js";

export const userController = {
  async post(req, res, next) {
    const { name, email, password } = req.body;

    const newHost = new Host({
      name,
      email,
      "local.password": password,
    });

    try {
      let result = await newHost.save();
      res.status(201).json({
        message: "User successfully added",
        status: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  },
};
