const express = require("express");
const {
  createUsers,
  loginUsers,
  getUsers,
  getAllUsers,
  updateSubscriptionPlan,
} = require("./../controllers/userController.js");
const { createNotes } = require("./../controllers/goalControllers.js");
const { protect } = require("../middlewares/protect.js");
const {
  makeDeposit,
  getDeposits,
  getDeposit,
  updateApproved,
  getUserDeposit,
} = require("./../controllers/depositController.js");
const {
  getWithdrawal,
  getWithdrawals,
  makeWithdrawal,
  approveWithdrawal,
  getUserWithdrawal,
} = require("./../controllers/withdrawController.js");

const userRouter = express.Router();
const notesRouter = express.Router();
const depositRouter = express.Router();
const withdrawRouter = express.Router();

userRouter.route("/").get(protect, getUsers);
userRouter.route("/all").get(protect, getAllUsers);
userRouter.route("/register").post(createUsers);
userRouter.route("/login").post(loginUsers);
userRouter.route("/subscription").patch(updateSubscriptionPlan);
notesRouter.route("/createnote").post(createNotes);
depositRouter.route("/").post(makeDeposit);
depositRouter.route("/").get(getDeposits);
depositRouter.route("/user").get(getUserDeposit);
depositRouter.route("/one").get(getDeposit);
depositRouter.route("/one").patch(updateApproved);
withdrawRouter.route("/").post(makeWithdrawal);
withdrawRouter.route("/").get(getWithdrawals);
withdrawRouter.route("/one").get(getWithdrawal);
withdrawRouter.route("/one").patch(approveWithdrawal);
withdrawRouter.route("/user").get(getUserWithdrawal);

module.exports = { userRouter, notesRouter, depositRouter, withdrawRouter };
