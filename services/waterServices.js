import { Water } from "../models/Water.js";
import { User } from "../models/User.js";

export const getDailyNorma = async (owner) => {
  const user = await User.findOne({ _id: owner });

  return user.dailyNorma;
};

export const findWaterByDate = async ({ owner, date }) => {
  const water = await Water.findOne({
    date: {
      $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    },
    owner,
  });
  return water;
};

export const addCountWater = async ({ body, owner, waterId }) => {
  const { entries } = await Water.findByIdAndUpdate(
    { _id: waterId, owner },
    {
      $inc: { totalVolume: +body.waterVolume },
      $push: { entries: body },
    },
    { new: true }
  );

  return entries[entries.length - 1];
};

export const createWater = async ({ owner, dailyNorma, date }) => {
  const newEntries = await Water.create({
    date,
    dailyNorma,
    entries: [],
    totalVolume: 0,
    owner,
  });
  return newEntries;
};

export const updateCountWater = async ({ owner, body, oldWaterVolume }) => {

  const updatedWater = await Water.findOneAndUpdate(
    { "entries._id": body.id, owner },
    {
      $set: {
        "entries.$.waterVolume": body.waterVolume,
        "entries.$.time": body.time,
      },
      $inc: { totalVolume: body.waterVolume - oldWaterVolume },
    },
    { new: true }
  );

  return updatedWater;
};

export const deleteCountWater = async ({ waterId, owner, waterVolume, date }) => {

  const deletedAmount = await Water.findOneAndUpdate(
    {
      date: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      },
      owner,
    },
    {
      $inc: { totalVolume: -waterVolume },
      $pull: { entries: { _id: waterId } },
    },
    { new: true }
  );

  return deletedAmount;
};
