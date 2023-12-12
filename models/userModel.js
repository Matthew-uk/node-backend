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
      default: 400,
    },
    referer: {
      type: String,
    },
    subscriptionPlan: {
      type: Number,
      default: 0,
    },
    referralAmount: {
      type: Number,
      default: 0,
    },
    referrals: [
      {
        type: Object,
        ref: "Users",
      },
    ],
  },
  { timestamps: true }
);

// Middleware to generate referral code before saving the document
userSchema.pre("save", async function (next) {
  if (!this.referralCode) {
    this.referralCode = generateReferralCode();
  }
  // If the user is new or the referrals array is empty, set it based on existing relationships
  if (!this.referrals || this.referrals.length === 0) {
    // Assuming `referer` holds the referralCode of the referring user
    const referringUser = await this.model("Users").findOne({
      referralCode: this.referer,
    });

    // Set the referrals field with the referring user's object
    this.referrals = referringUser ? [referringUser] : [];
  }
  next();
});

module.exports = mongoose.model("Users", userSchema);
