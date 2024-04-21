import * as waterServices from "../services/waterServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/HttpError.js";


import { waterLimits } from "../constants/water-constants.js";
import { calcFulfillment } from "../helpers/calcFulfillment";

const addWater = async (req, res) => {
  const { waterVolume } = req.body;
  const { _id: owner } = req.user;
  const date = new Date();
  let newWater = null;

  if (waterVolume > waterLimits.MAX_ONE_TIME_WATER_VALUE) {
    throw httpError(
      400,
      `waterVolume cannot exceed ${waterLimits.MAX_ONE_TIME_WATER_VALUE}`
    );
  }

  const dailyNorma = await waterServices.getDailyNorma(owner);

  newWater = await waterServices.findWaterByDate({ owner, date });

  if (!newWater) {
    newWater = await waterServices.createWater({ owner, dailyNorma, date });
  }

  const amountWater = await waterServices.addCountWater({
    body: req.body,
    owner,
    waterId: newWater._id,
  });

  if (!amountWater) {
    throw httpError(404);
  }

  res.json(amountWater);
};

const updateWater = async (req, res) => {
  const { waterVolume } = req.body;
  const { id } = req.params;
  const { _id: owner } = req.user;
  const date = new Date();

  if (waterVolume > waterLimits.MAX_ONE_TIME_WATER_VALUE) {
    throw httpError(
      400,
      `waterVolume cannot exceed ${waterLimits.MAX_ONE_TIME_WATER_VALUE}`
    );
  }

  const water = await waterServices.findWaterByDate({ owner, date });

  if (!water) {
    throw httpError(404);
  }

  const oldWaterVolume = water.waterNotes.find(
    (waterNote) => waterNote._id.toString() === id
  ).waterVolume;
  console.log(oldWaterVolume);

  const updatedWater = await waterServices.updateCountWater({
    owner,
    id: id,
    body: req.body,
    oldWaterVolume,
  });

  if (!updatedWater) {
    throw httpError(404);
  }

  const updatedNotes = updatedWater.waterNotes.find(
    (waterNote) => waterNote._id.toString() === id
  );

  res.json(updatedNotes);
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const date = new Date();

  const water = await waterServices.findWaterByDate({ owner, date });

  if (!water) {
    throw httpError(404);
  }

  console.log(water);
  console.log(water.waterNotes);

  const { waterVolume } = water.waterNotes.find((water) => water.id === id);

  const deletedWater = await waterServices.deleteCountWater({
    id,
    owner,
    waterVolume,
    date,
  });

  if (!deletedWater) {
    throw httpError(404);
  }

  res.json({ _id: id });
};

const getByDay = async (req, res) => {
  const { _id: owner } = req.user;

  const dailyWater = await waterServices.getNotesDaily({ owner });

  const dayResult = !dailyWater
    ? {}
    : {
        servingsCount: dailyWater.waterNotes.length,
        fulfillment: calcFulfillment(
          dailyWater.totalVolume,
          dailyWater.dailyNorma
        ),
        dayNotes: dailyWater.waterNotes,
        totalVolume: dailyWater.totalVolume,
        dailyNorma: dailyWater.dailyNorma,
      };

  res.json(dayResult);
};

const getByMonth = async (req, res) => {
  const { _id: owner } = req.user;
  const { date } = req.params;
  const [year, month] = date.split("-");
  // const startDate = new Date(year, month - 1, 1);
  // const endDate = new Date(year, month, 0);

  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 0));

  const waterOfMonth = await waterServices.getEntriesMonthly({ owner, startDate, endDate });
  console.log(waterOfMonth);

  const waterOfMonthWithCalculation = waterOfMonth.map(item => {
    const itemObject = item.toObject(); // Преобразование в обычный объект
    return {
      ...itemObject,
      fulfillment: calcFulfillment(
          itemObject.totalVolume,
          itemObject.dailyNorma
      ),
      servingsCount: itemObject.waterNotes.length
    };
  });

  
  // if (!waterOfMonth.length) {
  //   throw httpError(404);
  // }
  // .setHours(0, 0, 0,0)

  // const monthlyData = [];

  // for (let day = 1; day <= endDate.getDate(); day++) {
  //   const currentDate = new Date(Date.UTC(year, month - 1, day));
  //   const waterDay = waterOfMonth.find(entry => entry.date.getDate() === day);
  //   // Если для текущего дня есть данные о потреблении воды
  //   if (waterDay) {
  //     const dailyPercentage = Math.floor((waterDay.totalVolume / waterDay.dailyNorma) * 100);
  //     monthlyData.push({
  //       id: waterDay._id,
  //       date: currentDate,
  //       amountOfWater: waterDay.waterNotes.length,
  //       dailyNorma: waterDay.dailyNorma,
  //       percentage: dailyPercentage
  //     });
  //   }
    // else {
    //   // Если для текущего дня нет данных, добавляем пустую запись
    //   monthlyData.push({
    //     id: null,
    //     date: currentDate,
    //     amountOfWater: 0,
    //     dailyNorma: null,
    //     percentage: null
    //   });
    // }
  // }
  // if (!monthlyData.length) {
  //   throw httpError(404);
  // }

  res.json({ month: waterOfMonthWithCalculation });
};


export default {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
  getByDay: ctrlWrapper(getByDay),
  getByMonth: ctrlWrapper(getByMonth)
};
