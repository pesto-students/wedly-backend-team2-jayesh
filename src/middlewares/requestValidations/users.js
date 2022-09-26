import Joi from "joi";

function getDataSchema() {
  return Joi.object({
    name: Joi.string(),
    type: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    isVerified: Joi.bool(),
  });
}

export async function userValidation(req, res, next) {
  const validationSchema = await getDataSchema(req, res);
  const userInput = req.body;
  const { error } = validationSchema.validate(userInput);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}
