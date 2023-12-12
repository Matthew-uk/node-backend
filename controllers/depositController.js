const depositModel = require("./../models/deposit");
const asyncHandler = require("express-async-handler");
const userModel = require("./../models/userModel");
const multer = require("multer");
const path = require("path");
const deposit = require("./../models/deposit");

const getDeposits = asyncHandler(async (req, res) => {
  try {
    const deposits = await depositModel.find();
    res.json(deposits);
  } catch (error) {
    res.status(404).json(error.message);
  }
});

const getUserDeposit = asyncHandler(async (req, res) => {
  try {
    const id = req.query?.id;
    const userDeposit = await deposit.find({ userId: id });
    res.json(userDeposit);
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
  const currentUser = await userModel.findOne({ _id: userId });
  const referrer = await userModel.findOne({
    referralCode: currentUser.referer,
  });
  try {
    const newDeposit = await depositModel.create({
      userId,
      deposit,
      proofOfPayment,
    });
    console.log(referrer);
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

    const user = await userModel.findById(deposit.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += deposit.deposit;
    await user.save();

    const REFERRAL_PERCENTAGE = 0.23;
    let referer = null; // Declare referer outside the if block

    if (user.referer) {
      referer = await userModel.findOneAndUpdate(
        { referralCode: user.referer },
        { $inc: { referralAmount: REFERRAL_PERCENTAGE * deposit.deposit } },
        { new: true }
      );

      if (referer) {
        referer.balance += REFERRAL_PERCENTAGE * deposit.deposit;
        await referer.save();
        console.log(referer);
      } else {
        console.log("Referrer not found.");
      }
    }

    deposit.approved = true;
    deposit.pending = false;
    await deposit.save();

    res.json({ deposit, referer });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = {
  makeDeposit,
  getDeposits,
  getDeposit,
  updateApproved,
  getUserDeposit,
};
