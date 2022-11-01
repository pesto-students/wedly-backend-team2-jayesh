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
      const hostId = req.user._id ? req.user._id : req.user[0]["_id"];
      try {
        const existingBride = await Bride.find({
          hostId: hostId,
        });
        const existingGroom = await Groom.find({
          hostId: hostId,
        });
        if (existingBride.length === 0 && existingGroom.length === 0) {
          const bride = new Bride({
            name: brideName,
            fatherName: brideFatherName,
            motherName: brideMotherName,
            city: brideCity,
            state: brideState,
            hostId: hostId,
          });

          const groom = new Groom({
            name: groomName,
            fatherName: groomFatherName,
            motherName: groomMotherName,
            city: groomCity,
            state: groomState,
            hostId: hostId,
          });
          const newBride = await bride.save();
          const newGroom = await groom.save();
          return res.status(201).json({
            message: "Bride and groom details successfully saved!",
            newBride,
            newGroom,
          });
        } else {
          const updatedBride = await Bride.findOneAndUpdate(
            { hostId: hostId },
            {
              name: brideName,
              fatherName: brideFatherName,
              motherName: brideMotherName,
              city: brideCity,
              state: brideState,
              hostId: hostId,
            },
            { new: true },
          );

          const updatedGroom = await Groom.findOneAndUpdate(
            { hostId: hostId },
            {
              name: groomName,
              fatherName: groomFatherName,
              motherName: groomMotherName,
              city: groomCity,
              state: groomState,
              hostId: hostId,
            },
            { new: true },
          );
          return res.status(201).json({
            message: "Bride and groom details successfully updated!",
            updatedBride,
            updatedGroom,
          });
        }
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Some error occurred. Please try again!", err });
      }
    } else {
      res.status(401).json({
        message: "Please login first to add or update wedding details!",
      });
    }
  },

  async getDetails(req, res) {
    if (req.user) {
      try {
        const hostId = req.user._id ? req.user._id : req.user[0]["_id"];
        const bride = await Bride.findOne({
          hostId: hostId,
        });
        const groom = await Groom.findOne({
          hostId: hostId,
        });

        res.status(200).json({
          bride,
          groom,
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
