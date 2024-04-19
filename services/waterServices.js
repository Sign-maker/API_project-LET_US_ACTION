import { Water } from "../models/Water.js";
import { User } from "../models/User.js";

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

export const createWater = async ({ owner, dailyNorma, date }) => {
  const newData = await Water.create({
    date,
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
      },
      $inc: { totalVolume: body.waterVolume - oldWaterVolume },
    },
    { new: true }
  );

  return updatedWater;
};

export const deleteCountWater = async ({ id, owner, waterVolume, date }) => {
  
  const deletedCount = await Water.findOneAndUpdate(
    {
      date: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
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

export const getNotesDaily = async ({ owner }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Устанавливаем время на начало дня
  console.log("today: ", today);

  const dateUTC = today.toUTCString();
  console.log("dateUTC: ", dateUTC);
  const date = new Date(dateUTC);
  console.log("date: ", date.getMonth());
  
  const waterData = await Water.findOne({
    date: {
      $gte: dateUTC,  // выполняем сортировку по дате, если дата >= today и по владельцу
    },
    owner,
  });
  
  console.log(waterData.date);

  return waterData;
};