import { Guest } from "../models/Guest.js";

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
export const guestsController = {
  async addSingleGuest(req, res) {
    if (req.user) {
      const { name, mobile, email, isInvited } = req.body;
      const hostId = req.user._id ? req.user._id : req.user[0]["_id"];
      const guest = new Guest({
        name,
        mobile,
        email,
        isInvited,
        hostId: hostId,
      });

      try {
        const addedGuest = await guest.save();
        return res
          .status(201)
          .json({ message: "Guest details successfully saved!", addedGuest });
      } catch (err) {
        return res.status(500).json({ message: "Something went wrong!", err });
      }
    } else {
      res.status(401).json({
        message: "Please login first to add guest details!",
      });
    }
  },

  async addMultipleGuests(req, res) {
    if (req.user) {
      const hostId = req.user._id ? req.user._id : req.user[0]["_id"];
      const arrayOfGuests = req.body;
      arrayOfGuests.map((Guest) => {
        Guest["hostId"] = hostId;
      });
      try {
        const addedGuests = await Guest.insertMany(arrayOfGuests);
        res.status(201).json({
          message: "Multiple guests were added successfully.",
          addedGuests,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong!",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to add multiple guests!",
      });
    }
  },

  async getAllGuests(req, res) {
    if (req.user) {
      try {
        const hostId = req.user._id ? req.user._id : req.user[0]["_id"];
        const guests = await Guest.find({
          hostId: hostId,
        });

        res.status(200).json({
          guests,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to get guest details!",
      });
    }
  },

  async updateGuest(req, res) {
    if (req.user) {
      const { id } = req.body;
      const updateObj = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== null) {
          updateObj[key] = req.body[key];
        }
      });
      delete updateObj.id;
      try {
        const updatedGuest = await Guest.findByIdAndUpdate(id, updateObj, {
          new: true,
        });
        res.status(201).json({
          message: "Guest updated successfully",
          updatedGuest,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to update guest details!",
      });
    }
  },

  async deleteGuest(req, res) {
    if (req.user) {
      const { id } = req.body;
      try {
        const deletedGuest = await Guest.findByIdAndDelete(id);
        res.status(200).json({
          message: "Guest deleted successfully",
          deletedGuest,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to delete guest details!",
      });
    }
  },
};
