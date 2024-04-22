import express from "express";
import validateBody from "../helpers/validateBody.js";
import waterSchemas from "../schemas/waterSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { isValidId } from "../middlewares/isValidId.js";
import { isValidDate } from "../middlewares/isValidDate.js";
import waterController from "../controllers/waterControllers.js";

const waterRouter = express.Router();

waterRouter.post(
  "/",
  authenticate,
  validateBody(waterSchemas.waterSchema),
  waterController.addWater
);

waterRouter.patch(
  "/:id",
  authenticate,
  isValidId,
  validateBody(waterSchemas.updateWaterSchema),
  waterController.updateWater
);

waterRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  waterController.deleteWater
);

waterRouter.get(
  "/today",
  authenticate,
  waterController.getByDay
);

waterRouter.get(
  "/month/:date",
  authenticate,
  isValidDate,
  waterController.getByMonth
);

export default waterRouter;
