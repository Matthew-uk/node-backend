const { mongoose } = require("mongoose");

const depositSchema = mongoose.Schema(
  {
    userId: String,
    amount: Number,
    proofOfPayment: String,
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposits", depositSchema);
