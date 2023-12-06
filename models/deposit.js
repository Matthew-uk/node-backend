const { mongoose } = require("mongoose");

const depositSchema = mongoose.Schema(
  {
    userId: String,
    deposit: Number,
    proofOfPayment: String,
    approved: { type: Boolean, default: false },
    pending: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposits", depositSchema);
