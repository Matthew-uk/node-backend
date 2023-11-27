const express = require("express");
const {
  createUsers,
  loginUsers,
  getUsers,
  getAllUsers,
} = require("./../controllers/userController.js");
const { createNotes } = require("./../controllers/goalControllers.js");
const { protect } = require("../middlewares/protect.js");

const userRouter = express.Router();
const notesRouter = express.Router();

userRouter.route("/").get(protect, getUsers);
userRouter.route("/all").get(protect, getAllUsers);
userRouter.route("/register").post(createUsers);
userRouter.route("/login").post(loginUsers);
notesRouter.route("/createnote").post(createNotes);

module.exports = { userRouter, notesRouter };
