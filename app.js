import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import contactsRouter from "./routes/contactsRouter.js";
import userRouter from "./routes/authRouter.js";

const app = express();
const { PORT, DB_HOST } = process.env;

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
