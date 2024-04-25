import * as waterServices from "../services/waterServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/HttpError.js";

import { calcFulfillment } from "../helpers/calcFulfillment";

const getDayBorders = (startOfDay) => {
  const dayStart = new Date(startOfDay);
  const dayEnd = new Date(startOfDay);
  dayEnd.setDate(dayEnd.getDate() + 1);
  return { dayStart, dayEnd };
};

const getMonthBorders = (startOfMonth) => {
  const monthStart = new Date(startOfMonth);
  const monthEnd = new Date(startOfMonth);
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  return { monthStart, monthEnd };
};

const addWater = async (req, res) => {
  const { waterVolume } = req.body;
  const { _id: owner } = req.user;

  const { todayStart } = req.query;

  const { dayStart, dayEnd } = getDayBorders(todayStart);

  let newWater = null;

  const dailyNorma = await waterServices.getDailyNorma(owner);

  newWater = await waterServices.getNotesDaily(owner, dayStart, dayEnd);

  if (!newWater) {
    newWater = await waterServices.createWater(owner, dailyNorma, dayStart);
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
  const { todayStart } = req.query;

  const { dayStart, dayEnd } = getDayBorders(todayStart);

  const water = await waterServices.getNotesDaily(owner, dayStart, dayEnd);

  if (!water) {
    throw httpError(404);
  }

  const oldWater = water.waterNotes.find(
    (waterNote) => waterNote._id.toString() === id
  );
  if (!oldWater) {
    throw httpError(404);
  }
  const oldWaterVolume = oldWater.waterVolume;

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
  const { todayStart } = req.query;

  const { dayStart, dayEnd } = getDayBorders(todayStart);

  const water = await waterServices.getNotesDaily(owner, dayStart, dayEnd);

  if (!water) {
    throw httpError(404);
  }

  const { waterVolume } = water.waterNotes.find((water) => water.id === id);

  const deletedWater = await waterServices.deleteCountWater({
    id,
    owner,
    waterVolume,
    dayStart,
    dayEnd,
  });

  if (!deletedWater) {
    throw httpError(404);
  }

  res.json({ _id: id });
};

const getByDay = async (req, res) => {
  const { _id: owner } = req.user;
  const { todayStart } = req.query;

  const { dayStart, dayEnd } = getDayBorders(todayStart);

  const dailyWater = await waterServices.getNotesDaily(owner, dayStart, dayEnd);

  const dayResult = !dailyWater
    ? {
        servingsCount: null,
        fulfillment: null,
        dayNotes: [],
        totalVolume: null,
        dailyNorma: req.user.dailyNorma,
      }
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
  const { startOfMonth } = req.query;

  const { monthStart, monthEnd } = getMonthBorders(startOfMonth);

  const waterOfMonth = await waterServices.getEntriesMonthly(
    owner,
    monthStart,
    monthEnd
  );

  const waterOfMonthWithCalculation = waterOfMonth.map(
    ({ totalVolume, waterNotes, dailyNorma, date }) => {
      return {
        date,
        dailyNorma,
        totalVolume,
        fulfillment: calcFulfillment(totalVolume, dailyNorma),
        servingsCount: waterNotes.length,
      };
    }
  );

  res.json({ month: monthStart, monthNotes: waterOfMonthWithCalculation });
};

export default {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
  getByDay: ctrlWrapper(getByDay),
  getByMonth: ctrlWrapper(getByMonth),
};
