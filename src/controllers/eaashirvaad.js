/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import Razorpay from "razorpay";
import crypto from "crypto";
import { RAZORPAY_TEST_ID, RAZORPAY_TEST_SECRET } from "../../config/index.js";
export const eaashirvaadController = {
  async sendPayment(req, res) {
    try {
      const instance = new Razorpay({
        key_id: RAZORPAY_TEST_ID,
        key_secret: RAZORPAY_TEST_SECRET,
      });

      const options = {
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
      };

      instance.orders.create(options, (err, order) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Something Went Wrong!" });
        }
        res.status(200).json({ data: order });
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  },

  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", RAZORPAY_TEST_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        return res
          .status(200)
          .json({ message: "Payment verified successfully" });
      } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
      console.log(error);
    }
  },
};
