import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";
// import { dateRegexp } from "../constants/user-constants.js";

const notesSchema = new Schema({
  waterVolume: {
    type: Number,
    required: [true, "Add volume of water"],
  },
  date: {
    type: Date,
    required: [true, "Time is required"],
  },
});

const waterSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    dailyNorma: {
      type: Number,
      default: 2000,
      required: [true, "dailyNorma is required"],
    },
    waterNotes: [notesSchema],
    totalVolume: {
      type: Number,
      default: 0,
      required: [true, "totalVolume is required"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

waterSchema.post("save", handleSaveError);

waterSchema.pre("findOneAndUpdate", setUpdateSettings);

waterSchema.post("findOneAndUpdate", handleSaveError);

export const Water = model("water", waterSchema);
