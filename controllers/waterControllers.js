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

export default {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
  getByDay: ctrlWrapper(getByDay),
};
