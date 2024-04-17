import * as waterServices from "../services/waterServices.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import httpError from "../helpers/HttpError.js";




const addWater = async (req, res) => {
  const { waterVolume } = req.body;
  const { _id: owner } = req.user;
  const date = new Date();
  let newWater = null;

  if (waterVolume > 5000) {
    throw httpError(400, "waterVolume cannot exceed 5000");
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

  if (waterVolume > 5000) {
    throw httpError(400, "waterVolume cannot exceed 5000");
  }

  const water = await waterServices.findWaterByDate({ owner, date });

  if (!water) {
    throw httpError(404);
  }

  const oldWaterVolume = water.entries.find(
    (entry) => entry._id.toString() === id
  ).waterVolume;

  const updatedWater = await waterServices.updateCountWater({
    owner,
    body: req.body,
    oldWaterVolume,
  });

  if (!updatedWater) {
    throw httpError(404);
  }

  const updatedEntry = updatedWater.entries.find(
    (entry) => entry._id.toString() === id
  );

  res.json(updatedEntry);

};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { waterId } = req.params;
  const date = new Date();

  const water = await waterServices.findWaterByDate({owner, date});

  if (!water) {
    throw httpError(404);
  }

  const { waterVolume } = water.entries.find((water) => water.id === waterId);
  
  const deletedWater = await waterServices.deleteCountWater({ waterId, owner, waterVolume, date });

  if (!deletedWater) {
    throw httpError(404);
  }

  res.json({ _id: waterId });
};



export default {
  addWater: ctrlWrapper(addWater),
  updateWater: ctrlWrapper(updateWater),
  deleteWater: ctrlWrapper(deleteWater),
};