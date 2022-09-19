import { Host } from "../models/Person.js";

export const userController = {
  async post(req, res, next) {
    const { name, type, email, password, isVerified } = req.body;

    const newHost = new Host({
      name,
      type,
      email,
      password,
      isVerified,
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
