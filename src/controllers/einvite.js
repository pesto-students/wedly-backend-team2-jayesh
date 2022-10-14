import { EInvite } from "../models/EInvite.js";

/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
export const einviteController = {
  async addContent(req, res) {
    if (req.user) {
      const {
        templateId,
        page1Content,
        page2Content,
        page3Content,
        page4Content,
      } = req.body;
      const hostId = req.user._id;

      const existingTemplate = await EInvite.find({ templateId });
      if (existingTemplate.length === 0) {
        const einvite = new EInvite({
          templateId,
          page1Content,
          page2Content,
          page3Content,
          page4Content,
          hostId,
        });
        try {
          const addedContent = await einvite.save();
          return res.status(201).json({
            message: "E-Invite details successfully saved!",
            addedContent,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ message: "Something went wrong!", err });
        }
      } else {
        try {
          const updatedEInvite = await EInvite.findOneAndUpdate(
            { templateId: templateId },
            {
              page1Content: page1Content,
              page2Content: page2Content,
              page3Content: page3Content,
              page4Content: page4Content,
            },
            { new: true },
          );
          return res.status(201).json({
            message: "E-Invite details successfully saved!",
            updatedEInvite,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ message: "Something went wrong!", err });
        }
      }
    } else {
      res.status(401).json({
        message: "Please login first to add einvite details!",
      });
    }
  },

  async getContent(req, res) {
    if (req.user) {
      const { templateId } = req.body;
      try {
        const response = await EInvite.find({ templateId });
        const einvite = response[0];
        if (response.length !== 0) {
          return res.status(200).json({
            einvite,
          });
        } else {
          return res.status(200).json({
            message: "No such einvite found",
          });
        }
      } catch (err) {
        return res.status(500).json({ message: "Something went wrong!", err });
      }
    } else {
      res.status(401).json({
        message: "Please login first to get einvite details!",
      });
    }
  },
};
