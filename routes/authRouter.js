import express from "express";
import authController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import userSchemas from "../schemas/userSchemas.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  validateBody(userSchemas.userSignUpSchema),
  authController.signup
);

userRouter.post(
  "/signin",
  validateBody(userSchemas.userSignInSchema),
  authController.signin
);

userRouter.get("/current", authenticate, authController.getCurrent);

userRouter.post("/logout", authenticate, authController.signout);

userRouter.post(
  "/waterrate",
  authenticate,
  validateBody(userSchemas.waterRateSchema),
  authController.updateUser
);

// userRouter.patch(
//   "/",
//   authenticate,
//   validateBody(userSchemas.userUpdateSchema),
//   authController.updateUser
// );

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  authController.updateAvatar
);

userRouter.patch(
  "/waterrate",
  authenticate,
  validateBody(userSchemas.waterRateSchema),
  authController.updateWaterRate
);

userRouter.patch(
  "/profile",
  authenticate,
  validateBody(userSchemas.userUpdateSchema),
  authController.updateProfile
);

export default userRouter;
