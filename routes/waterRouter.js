import express from "express";
import validateBody from "../helpers/validateBody";
import waterSchemas from "../schemas/waterSchemas";
import { authenticate } from "../middlewares/authenticate";
import { isValidId } from "../middlewares/isValidId";

const waterRouter = express.Router();

waterRouter.post(
  "/water",
  authenticate,
  validateBody(waterSchemas.waterSchema),
  waterController.addWater
);

waterRouter.patch(
  "/water/:id",
  authenticate,
  validateBody(waterSchemas.updateWaterSchema),
  waterController.updateWater
);

waterRouter.delete(
  "/water/:id",
  authenticate,
  isValidId,
  waterController.deleteWater
);

waterRouter.get("/today", authenticate, waterController.getByDay);

waterRouter.get("/month/:month", authenticate, waterController.getByMonth);

export default waterRouter;
