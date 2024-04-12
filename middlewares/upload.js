import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";
import { ALLOWED_AVATAR_EXTENSIONS } from "../constants/user-constants.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 4,
};

const fileFilter = function (req, file, cb) {
  const extension = file.originalname.split(".").pop();

  if (!ALLOWED_AVATAR_EXTENSIONS.includes(extension)) {
    return cb(
      HttpError(
        400,
        `${extension} is not valid picture format, use ${ALLOWED_AVATAR_EXTENSIONS.join(
          ", "
        )}`
      )
    );
  }

  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
