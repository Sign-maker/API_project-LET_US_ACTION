import HttpError from "../helpers/HttpError.js";
import { yearMonthRegex } from "../constants/water-constants.js";

export const isValidDate = (req, _, next) => {
  const { date } = req.params;
  if (!yearMonthRegex.test(date)) {
    return next(HttpError(400, `date ${date} doesn't match the specified format. Use YYYY-MM`));
  }
  next();
};