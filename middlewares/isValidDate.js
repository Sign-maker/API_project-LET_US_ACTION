import HttpError from "../helpers/HttpError.js";
import { dateUTCRegex, yearMonthRegex } from "../constants/water-constants.js";

export const isValidDate = (req, _, next) => {
  const { date } = req.params;
  if (!yearMonthRegex.test(date)) {
    return next(
      HttpError(
        400,
        `date ${date} doesn't match the specified format. Use YYYY-MM`
      )
    );
  }
  next();
};

export const isValidDateUTC = (req, _, next) => {
  const { todayStart } = req.query;
  if (!dateUTCRegex.test(todayStart)) {
    return next(
      HttpError(
        400,
        `date ${todayStart} doesn't match the specified format. Use YYYY-MM-DDTHH:MM:SS.MSMSMSZ`
      )
    );
  }
  next();
};

export const isValidDateUTCMonth = (req, _, next) => {
  const { startOfMonth } = req.query;
  if (!dateUTCRegex.test(startOfMonth)) {
    return next(
      HttpError(
        400,
        `date ${startOfMonth} doesn't match the specified format. Use YYYY-MM-DDTHH:MM:SS.MSMSMSZ`
      )
    );
  }
  next();
};
