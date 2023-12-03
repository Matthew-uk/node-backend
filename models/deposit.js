const { mongoose } = require("mongoose");

const depositSchema = mongoose.Schema(
  {
    userId: String,
    amount: Number,
    proofOfPayment: String,
    approved: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposits", depositSchema);
