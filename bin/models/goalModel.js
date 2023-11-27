const mongoose = require("mongoose");

const goalModel = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    goalName: {
      type: String,
      required: true,
    },
    goalDescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("goals", goalModel);
