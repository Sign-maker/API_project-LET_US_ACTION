import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const isValidId = (req, _, next) => {
  const { waterId } = req.params;
  if (!isValidObjectId(waterId )) {
    return next(HttpError(400, `${waterId} is not a valid id`));
  }
  next();
};
