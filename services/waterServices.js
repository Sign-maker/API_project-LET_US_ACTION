import { Water } from "../models/Water.js";
import { User } from "../models/User.js";

export const updateDailyNorma = async ({
  owner,
  dailyNorma,
  dayStart,
  dayEnd,
}) => {
  const waterData = await Water.findOneAndUpdate(
    {
      date: { $gte: dayStart, $lt: dayEnd },
      owner,
    },
    { dailyNorma },
    { new: true }
  );

  return waterData;
};

export const getDailyNorma = async (owner) => {
  const user = await User.findOne({ _id: owner });

  return user.dailyNorma;
};

export const findWaterByDate = async ({ owner, date }) => {
  const water = await Water.findOne({
    date: {
      $gte: date,
    },
    owner,
  });
  return water;
};

export const addCountWater = async ({ body, owner, waterId }) => {
  const { waterNotes } = await Water.findByIdAndUpdate(
    { _id: waterId, owner },
    {
      $inc: { totalVolume: +body.waterVolume },
      $push: { waterNotes: body },
    },
    { new: true }
  );

  return waterNotes[waterNotes.length - 1];
};

export const createWater = async (owner, dailyNorma, dayStart) => {
  const newData = await Water.create({
    date: dayStart,
    dailyNorma,
    waterNotes: [],
    totalVolume: 0,
    owner,
  });
  return newData;
};

export const updateCountWater = async ({ owner, id, body, oldWaterVolume }) => {
  const updatedWater = await Water.findOneAndUpdate(
    { "waterNotes._id": id, owner },
    {
      $set: {
        "waterNotes.$.waterVolume": body.waterVolume,
        "waterNotes.$.date": body.date,
      },
      $inc: { totalVolume: body.waterVolume - oldWaterVolume },
    },
    { new: true }
  );

  return updatedWater;
};

export const deleteCountWater = async ({
  id,
  owner,
  waterVolume,
  dayStart,
  dayEnd,
}) => {
  const deletedCount = await Water.findOneAndUpdate(
    {
      date: {
        $gte: dayStart,
        $lt: dayEnd,
      },
      owner,
    },
    {
      $inc: { totalVolume: -waterVolume },
      $pull: { waterNotes: { _id: id } },
    },
    { new: true }
  );

  return deletedCount;
};

export const getNotesDaily = async (owner, dayStart, dayEnd) => {
  const waterData = await Water.findOne({
    date: {
      $gte: dayStart,
      $lt: dayEnd,
    },
    owner,
  });

  return waterData;
};

export const getEntriesMonthly = async (owner, startDate, endDate) => {
  const waterOfMonth = await Water.find({
    date: { $gte: startDate, $lt: endDate },
    owner,
  });

  return waterOfMonth;
};
