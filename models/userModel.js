const mongoose = require("mongoose");

const generateReferralCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const codeLength = 8;
  let referralCode = "";
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }
  return referralCode;
};

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      min_length: 6,
      trim: true,
    },
    referralCode: {
      type: String,
    },
    balance: {
      type: Number,
      default: 200,
    },
    referer: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware to generate referral code before saving the document
userSchema.pre("save", function (next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  next();
});

module.exports = mongoose.model("Users", userSchema);
