const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const goalModel = require("./../models/goalModel");

const getGoals = async (req, res) => {
  try {
    // const userId = await req.user.id;
    const goal = await goalModel.find({ userId: req.user.id });
    const user = await userModel.findById(req.user.id);
    const { name } = req.query;
    // console.log(user.fullName);
    res.status(200).json({
      status: 200,
      user,
      user: user.fullName,
      goal,
      query: name,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};

const createGoal = async (req, res) => {
  try {
    const { goalName, goalDescription } = await req.body;
    if (goalName && goalDescription) {
      const userId = await req.user.id;
      console.log(userId);
      const newGoal = await goalModel.create({
        userId,
        goalName,
        goalDescription,
      });
      res.status(201).json({
        status: "success",
        newGoal,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const deleteGoal = expressAsyncHandler(async (id) => {
  try {
    const goal = await goalModel.findById(id);
    if (goal) {
      goal.remove();
    } else {
      throw new Error("Goal cannot be deleted");
    }
  } catch (error) {}
});

module.exports = { getGoals, createGoal };
