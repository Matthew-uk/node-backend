const { mongoose } = require("mongoose");

const withdrawSchema = mongoose.Schema(
  {
    userId: String,
    withdraw: Number,
    bankName: String,
    accountName: String,
    accountNumber: Number,
    approved: { type: Boolean, default: false },
    pending: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("withdrawals", withdrawSchema);
