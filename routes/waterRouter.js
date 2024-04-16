import express from "express";
import validateBody from "../helpers/validateBody";
import waterSchemas from "../schemas/waretSchemas";

const waterRouter = express.Router();

waterRouter.post(
  "/water",
  validateBody(waterSchemas),
  waterController.addWater
);

export default waterRouter;
