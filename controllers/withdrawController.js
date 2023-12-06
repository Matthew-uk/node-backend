const withdrawModel = require("./../models/withdraw");
const asyncHandler = require("express-async-handler");
const userModel = require("./../models/userModel");
const multer = require("multer");
const path = require("path");

const getWithdrawals = asyncHandler(async (req, res) => {
  try {
    const withdrawals = await withdrawModel.find();
    res.json(withdrawals);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const getWithdrawal = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id;
    const withdrawal = await withdrawModel.findOne({ _id: id });
    res.json(withdrawal);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const getUserWithdrawal = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id;
    const userWithdraw = await withdrawModel.find({ userId: id });
    res.json(userWithdraw);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const makeWithdrawal = asyncHandler(async (req, res) => {
  const { userId, withdraw, bankName, accountNumber, accountName } =
    await req.body;
  try {
    const newWithdrawal = await withdrawModel.create({
      userId,
      withdraw,
      bankName,
      accountName,
      accountNumber,
    });
    res.json(newWithdrawal);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const approveWithdrawal = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id;

    const withdraw = await withdrawModel.findById(id);

    if (!withdraw) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    const user = await userModel.findById(withdraw.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for the withdrawal" });
    }

    const previousBalance = await user.balance;

    // Update user's balance
    user.balance = previousBalance - withdraw.withdraw;

    try {
      // Save user with updated balance
      await user.save();
    } catch (error) {
      // Rollback withdrawal approval if user update fails
      withdraw.approved = false;
      withdraw.pending = false;
      await withdraw.save();
      return res.status(500).json({
        message: "Failed to update user balance",
        error: error.message,
      });
    }

    // Mark withdrawal as approved
    withdraw.approved = true;
    withdraw.pending = false;
    await withdraw.save();

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = {
  makeWithdrawal,
  getWithdrawals,
  getWithdrawal,
  approveWithdrawal,
  getUserWithdrawal,
};
