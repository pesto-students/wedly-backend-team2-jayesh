import { Event } from "../models/Event.js";

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
export const eventsController = {
  async addSingleEvent(req, res) {
    if (req.user) {
      const { category, customEvent, date, time, venue } = req.body;

      const event = new Event({
        category,
        customEvent,
        date,
        time,
        venue,
        hostId: req.user._id,
      });

      try {
        const addedEvent = await event.save();
        return res
          .status(201)
          .json({ message: "Event details successfully saved!", addedEvent });
      } catch (err) {
        return res.status(500).json({ message: "Something went wrong!", err });
      }
    } else {
      res.status(401).json({
        message: "Please login to add event details!",
      });
    }
  },

  async addMultipleEvents(req, res) {
    if (req.user) {
      const arrayOfEvents = req.body;
      arrayOfEvents.map((event) => {
        event["hostId"] = req.user._id;
      });
      try {
        const addedEvents = await Event.insertMany(arrayOfEvents);
        res.status(201).json({
          message: "Multiple Events were added successfully.",
          addedEvents,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong!",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to add multiple events!",
      });
    }
  },

  async getAllEvents(req, res) {
    if (req.user) {
      try {
        const events = await Event.find({ hostId: req.user._id });

        res.status(200).json({
          events,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to get event details!",
      });
    }
  },

  async updateEvent(req, res) {
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
        const updatedEvent = await Event.findByIdAndUpdate(id, updateObj, {
          new: true,
        });
        res.status(201).json({
          message: "Event updated successfully",
          updatedEvent,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to update details!",
      });
    }
  },

  async deleteEvent(req, res) {
    if (req.user) {
      const { id } = req.body;
      try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        res.status(200).json({
          message: "Event deleted successfully",
          deletedEvent,
        });
      } catch (err) {
        res.status(500).json({
          message: "Something went wrong",
          err,
        });
      }
    } else {
      res.status(401).json({
        message: "Please login first to update details!",
      });
    }
  },
};
