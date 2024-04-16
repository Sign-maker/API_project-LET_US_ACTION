
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

//GET water/today
//req=headerAuth
// res= {"waterNotes": [
//     {
//       "_id": "6589ac824cf567a1bf12c294",
//       "date": "2024-04-15T21:41:38.920Z",
//       "waterVolume": 250
//     },
//     {
//       "_id": "6589ac824cf567a1bf12c294",
//       "date": "2024-04-15T21:41:38.920Z",
//       "waterVolume": 100
//     }

//   ],
//   totalVolume:8000}

//GET water/month?04-2024
// res = {
//   month: "04-2024",
//   monthStats: [
//     {
//       date: "2024-04-15T21:41:38.920Z",
//       daylyNorma: 1500,
//       fulfillment: 50,
//       servings: 6,
//     },
//   ],
// };
