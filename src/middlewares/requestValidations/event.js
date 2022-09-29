import Joi from "joi";

function getSingleDataSchema() {
  return Joi.object({
    category: Joi.string(),
    customEvent: Joi.string(),
    date: Joi.date(),
    time: Joi.string(),
    venue: Joi.string(),
  });
}

function getMultipleDataSchema() {
  return Joi.array().items(
    Joi.object({
      category: Joi.string(),
      customEvent: Joi.string(),
      date: Joi.date(),
      time: Joi.string(),
      venue: Joi.string(),
    }),
  );
}

export async function singleEventsValidation(req, res, next) {
  const validationSchema = await getSingleDataSchema(req, res);
  const userInput = req.body;
  const { error } = validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}

export async function multipleEventsValidation(req, res, next) {
  const validationSchema = await getMultipleDataSchema(req, res);
  const userInput = req.body;
  const { error } = validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
