import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import contactSchemas from "../schemas/contactsSchemas.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsController.getOneContact);

contactsRouter.delete("/:id", isValidId, contactsController.deleteContact);

contactsRouter.post(
  "/",
  validateBody(contactSchemas.createContactSchema),
  contactsController.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(contactSchemas.updateContactSchema),
  contactsController.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(contactSchemas.updateStatusContactSchema),
  contactsController.updateStatusContact
);

export default contactsRouter;
