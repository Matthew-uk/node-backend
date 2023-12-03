const depositModel = require("./../models/deposit");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");

const getDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await depositModel.find();
    res.json(deposits);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const makeDeposit = asyncHandler(async (req, res) => {
  const { userId, amount, proofOfPayment } = await req.body;
  try {
    const newDeposit = await depositModel.create({
      userId,
      amount,
      proofOfPayment,
    });
    res.json(newDeposit);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = { makeDeposit, getDeposits };
