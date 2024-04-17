import { Water } from "../models/Water.js";

export const updateDailyNorma = async ({ owner, dailyNorma }) => {
  const date = new Date();
  const startOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const endOfDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  const waterData = await Water.findOneAndUpdate(
    {
      date: { $gte: startOfDay, $lt: endOfDay },
      owner,
    },
    { dailyNorma },
    { new: true }
  );

  return waterData;
};
