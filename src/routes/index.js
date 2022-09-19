import express from "express";
import { userValidation } from "../middlewares/requestValidations/users.js";
import { userController } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", userValidation, userController.post);

export default router;
