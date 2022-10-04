import { Bride } from "../models/Bride.js";
import { Groom } from "../models/Groom.js";

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
export const weddingDetailsController = {
  async addDetails(req, res) {
    if (req.user) {
      const {
        brideName,
        brideMotherName,
        brideFatherName,
        brideState,
        brideCity,
        groomName,
        groomMotherName,
        groomFatherName,
        groomState,
        groomCity,
      } = req.body;

      const bride = new Bride({
        name: brideName,
        fatherName: brideFatherName,
        motherName: brideMotherName,
        city: brideCity,
        state: brideState,
        hostId: req.user._id,
      });

      const groom = new Groom({
        name: groomName,
        fatherName: groomFatherName,
        motherName: groomMotherName,
        city: groomCity,
        state: groomState,
        hostId: req.user._id,
      });

      try {
        const newBride = await bride.save();
        const newGroom = await groom.save();
        return res.status(201).json({
          message: "Bride and groom details successfully saved!",
          newBride,
          newGroom,
        });
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Some error occurred. Please try again!", err });
      }
    } else {
      res.status(401).json({
        message: "Please login first to add wedding details!",
      });
    }
  },

  async getDetails(req, res) {
    if (req.user) {
      try {
        const bride = await Bride.find();
        const groom = await Groom.find();

        res.status(200).json({
          bride: bride,
          groom: groom,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong!",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to get wedding details!",
      });
    }
  },
};
