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

const getDeposit = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id;
    const deposits = await depositModel.findOne({ _id: id });
    res.json(deposits);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const makeDeposit = asyncHandler(async (req, res) => {
  const { userId, deposit, proofOfPayment } = await req.body;
  try {
    const newDeposit = await depositModel.create({
      userId,
      deposit,
      proofOfPayment,
    });
    res.json(newDeposit);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const updateApproved = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id; // Assuming you're passing the deposit ID in the URL parameters

    const deposit = await depositModel.findById(id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    deposit.approved = true;
    await deposit.save();

    res.json(deposit);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = { makeDeposit, getDeposits, getDeposit, updateApproved };
