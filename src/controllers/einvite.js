/* eslint-disable no-console */
import { EinviteFirstPage } from "../models/EinviteFirstPage.js";
import { EinviteOtherPages } from "../models/EinviteOtherPages.js";
import { WHATSAPP_TOKEN, CLIENT_APP_URL } from "../../config/index.js";
import axios from "axios";

export const einviteController = {
  async addFirstPage(req, res) {
    if (req.user) {
      const { bride, groom, date, templateID } = req.body;
      const hostId = req.user._id ? req.user._id : req.user[0]["_id"];

      const existingFirstPage = await EinviteFirstPage.find({ hostId });
      if (existingFirstPage.length === 0) {
        const einviteFirstPage = new EinviteFirstPage({
          bride,
          groom,
          date,
          hostId,
          templateID,
        });
        try {
          const addedContent = await einviteFirstPage.save();
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
          const updatedEinviteFirstPage =
            await EinviteFirstPage.findOneAndUpdate(
              { hostId: hostId },
              {
                bride,
                groom,
                date,
                templateID,
              },
              { new: true },
            );
          return res.status(201).json({
            message: "E-Invite details successfully saved!",
            updatedEinviteFirstPage,
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
  async addOtherPages(req, res) {
    if (req.user) {
      const { category, customEvent, date, time, venue, page, templateID } =
        req.body;
      const hostId = req.user._id ? req.user._id : req.user[0]["_id"];

      const otherPages = await EinviteOtherPages.find({ hostId, page });
      if (otherPages.length === 0) {
        const einviteOtherPages = new EinviteOtherPages({
          category,
          customEvent,
          date,
          time,
          venue,
          page,
          hostId,
          templateID,
        });
        try {
          const addedContent = await einviteOtherPages.save();
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
          const updatedEInvite = await EinviteOtherPages.findOneAndUpdate(
            { hostId, page },
            {
              category,
              customEvent,
              date,
              time,
              venue,
              templateID,
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

  async getFirstPage(req, res) {
    try {
      const { hostID } = req.params;
      const response = await EinviteFirstPage.find({ hostId: hostID });
      const einviteFirstPage = response[0];
      if (response.length !== 0) {
        return res.status(200).json({
          einviteFirstPage,
        });
      } else {
        return res.status(200).json({
          message: "No such einvite found",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!", err });
    }
  },

  async getOtherPages(req, res) {
    const { hostID, page } = req.params;
    try {
      const response = await EinviteOtherPages.find({
        hostId: hostID,
        page: parseInt(page),
      });
      const einviteOtherPages = response[0];
      if (response.length !== 0) {
        return res.status(200).json({
          einviteOtherPages,
        });
      } else {
        return res.status(200).json({
          message: "No such einvite found",
        });
      }
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!", err });
    }
  },

  async getGuestEinvite(req, res) {
    const { hostID } = req.params;
    try {
      const einviteOtherPages = await EinviteOtherPages.find({
        hostId: hostID,
      });
      const einviteFirstPage = await EinviteFirstPage.findOne({
        hostId: hostID,
      });
      const einvite = [...einviteOtherPages, einviteFirstPage];
      if (einvite.length !== 0) {
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
  },

  async sendReminder(req, res) {
    const requestURL = `https://graph.facebook.com/v15.0/109962048563832/messages`;
    const { guestsArray, hostName, eventDetails } = req.body;
    try {
      for (let guest of guestsArray) {
        await axios.post(
          requestURL,
          {
            messaging_product: "whatsapp",
            to: `91${guest.mobile}`,
            type: "template",
            template: {
              name: "event",
              language: {
                code: "en",
              },
              components: [
                {
                  type: "body",
                  parameters: [
                    {
                      type: "text",
                      text: `${guest.name}`,
                    },
                    {
                      type: "text",
                      text: `${hostName}`,
                    },
                    {
                      type: "text",
                      text: `${
                        eventDetails.category || eventDetails.customEvent
                      }`,
                    },
                    {
                      type: "text",
                      text: `${eventDetails.date
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("-")}`,
                    },
                    {
                      type: "text",
                      text: `${eventDetails.time}`,
                    },
                    {
                      type: "text",
                      text: `${eventDetails.venue}`,
                    },
                  ],
                },
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          },
        );
      }
      res.status(200).json("Reminders were sent successfully");
    } catch (err) {
      res.status(500).json("Something went wrong", err);
    }
  },

  async sendInvite(req, res) {
    const requestURL = `https://graph.facebook.com/v15.0/109962048563832/messages`;
    const { from, to, mobile, userId } = req.body;
    try {
      await axios.post(
        requestURL,
        {
          messaging_product: "whatsapp",
          to: `91${mobile}`,
          type: "template",
          template: {
            name: "e_invite",
            language: {
              code: "en",
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: `${to}`,
                  },
                  {
                    type: "text",
                    text: `${from}`,
                  },
                  {
                    type: "text",
                    text: `${CLIENT_APP_URL}/einvite/view/${userId}`,
                  },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );
      res.status(200).json("Invite sent successfully");
    } catch (err) {
      res.status(500).json("Something went wrong", err);
    }
  },
};
