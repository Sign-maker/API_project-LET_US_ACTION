import express from "express";
import validateBody from "../helpers/validateBody.js";
import waterSchemas from "../schemas/waterSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isValidId } from "../middlewares/isValidId.js";
import {
  isValidDateUTC,
  isValidDateUTCMonth,
} from "../middlewares/isValidDate.js";
import waterController from "../controllers/waterControllers.js";

const waterRouter = express.Router();

waterRouter.post(
  "/",
  authenticate,
  isValidDateUTC,
  validateBody(waterSchemas.waterSchema),
  waterController.addWater
);

waterRouter.patch(
  "/:id",
  authenticate,
  isValidDateUTC,
  isValidId,
  validateBody(waterSchemas.updateWaterSchema),
  waterController.updateWater
);

waterRouter.delete(
  "/:id",
  authenticate,
  isValidDateUTC,
  isValidId,
  waterController.deleteWater
);

waterRouter.get(
  "/today",
  authenticate,
  isValidDateUTC,
  waterController.getByDay
);

waterRouter.get(
  "/month",
  authenticate,
  isValidDateUTCMonth,
  waterController.getByMonth
);

export default waterRouter;
