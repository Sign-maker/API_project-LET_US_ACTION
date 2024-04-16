import express from "express";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validateBody from "../helpers/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import waterController from "../controllers/waterController.js";
import schemas from "../schemas/waterSchemas.js";

const waterRouter = express.Router();

// waterRouter.get(
//   "/today",
//   authenticate,
//   ctrlWrapper(getToDay)
// );
// waterRouter.get(
//   "/month/:date", 
//   authenticate,
//   ctrlWrapper(getMonthly)
// );

waterRouter.post(
  "/add",
  authenticate,
  validateBody(schemas.waterSchemas),
  ctrlWrapper(waterController.addWater)
);
waterRouter.put(
  "/update",
  authenticate,
  validateBody(schemas.updateWaterSchemas),
  ctrlWrapper(waterController.updateWater)
);

waterRouter.delete("/delete/:waterId", authenticate, isValidId, ctrlWrapper(waterController.deleteWater));


export default waterRouter;