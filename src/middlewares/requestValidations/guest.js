import Joi from "joi";

function getSingleDataSchema() {
  return Joi.object({
    name: Joi.string(),
    mobile: Joi.string(),
    email: Joi.string(),
    isInvited: Joi.boolean(),
  });
}

function getMultipleDataSchema() {
  return Joi.array().items(
    Joi.object({
      name: Joi.string(),
      mobile: Joi.string(),
      email: Joi.string(),
      isInvited: Joi.boolean(),
    }),
  );
}

export async function singleGuestValidation(req, res, next) {
  const validationSchema = await getSingleDataSchema(req, res);
  const userInput = req.body;
  const { error } = validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}

export async function multipleGuestValidation(req, res, next) {
  const validationSchema = await getMultipleDataSchema(req, res);
  const userInput = req.body;
  const { error } = validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
