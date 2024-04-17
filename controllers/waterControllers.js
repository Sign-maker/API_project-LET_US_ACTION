import * as waterServices from "../services/waterServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/HttpError.js";

import { minWaterCount, maxWaterCount, maxDailyWaterCount } from "../constants/water-constants.js";

const addWater = async (req, res) => {
  const { waterVolume } = req.body;
  const { _id: owner } = req.user;
  const date = new Date();
  let newWater = null;

  if (waterVolume > maxWaterCount) {
    throw httpError(400, `waterVolume cannot exceed ${maxWaterCount}`);
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

  res.status(200).json(amountWater);
};

const updateWater = async (req, res) => {
  const {id,  waterVolume } = req.body;
  const { _id: owner } = req.user;
  const date = new Date();

  if (waterVolume > maxWaterCount) {
    throw httpError(400, `waterVolume cannot exceed ${maxWaterCount}`);
  }

  const water = await waterServices.findWaterByDate({ owner, date });

  if (!water) {
    throw httpError(404);
  }

  const oldWaterVolume = water.waterNotes.find(
    (waterNote) => waterNote._id.toString() === id
  ).waterVolume;

  const updatedWater = await waterServices.updateCountWater({
    owner,
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

  const water = await waterServices.findWaterByDate({owner, date});

  if (!water) {
    throw httpError(404);
  }
    
  console.log(water);
  console.log(water.waterNotes);

  const { waterVolume } = water.waterNotes.find((water) => water.id === id);

  
  const deletedWater = await waterServices.deleteCountWater({ id, owner, waterVolume, date });

  if (!deletedWater) {
    throw httpError(404);
  }

  res.json({ _id: id });
};

export default {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
};