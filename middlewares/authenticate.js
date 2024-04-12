import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { findUser } from "../services/authServices.js";

const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Not authorized"));
  }

  const [Bearer, token] = authorization.split(" ");
  if (Bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id: _id } = jwt.verify(token, JWT_SECRET);
    const user = await findUser({ _id });

    if (!user) {
      return next(HttpError(401, "Not authorized"));
    }

    if (!user.token || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
