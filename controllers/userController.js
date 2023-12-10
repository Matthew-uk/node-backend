const jwt = require("jsonwebtoken");
const userModel = require("./../models/userModel");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const path = require("path");
const cron = require("node-cron");

const getUsers = asyncHandler(async (req, res) => {
  const { fullName, email, balance, referralCode, _id, referralAmount } =
    await req.user;
  const referrals = await userModel.find({ referer: referralCode });

  try {
    res.status(200).json({
      fullName,
      email,
      balance,
      referralCode,
      id: _id,
      referrals,
      referralAmount,
    });
  } catch (error) {
    res.status(404).json(error.message);
  }
});

// const updateDailyBalances = async () => {
//   try {
//     // Fetch the specific user by _id
//     const user = await userModel.findById("6569fc2545c1ee58af49eb26");

//     // Check if the user exists
//     if (!user) {
//       console.log("User not found.");
//       return;
//     }

//     // Adjust balance as needed
//     user.balance += 10; // Increase balance by 10 (adjust this value)

//     // Save the updated user
//     await user.save();

//     console.log("User balance updated successfully.");
//   } catch (error) {
//     console.error("Error updating user balance:", error);
//   }
// };

// // Schedule the cron job to run the updateDailyBalances function every 10 seconds
// cron.schedule("*/10 * * * * *", updateDailyBalances);

const updateDailyBalances = async () => {
  try {
    // Fetch users subscribed to specific plans
    const subscribedUsers = await userModel.find({
      subscriptionPlan: {
        $in: [2000, 5000, 10000, 20000, 25000, 50000, 100000, 200000, 400000],
      },
    });

    const totalBonusAmount = subscribedUsers.reduce(
      (total, user) => total + 0.2 * user.subscriptionPlan,
      0
    );

    const bonusPerUpdate = totalBonusAmount / (24 * 60 * 6); // 6 updates per minute for 24 hours

    // Update balances
    const updatePromises = subscribedUsers.map(async (user) => {
      // Calculate bonus amount for this update and add it to the balance
      const bonusAmount = bonusPerUpdate;
      user.balance += bonusAmount;

      // Save the updated user
      await user.save();
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log("Daily balances updated successfully.");
  } catch (error) {
    console.error("Error updating daily balances:", error);
  }
};

// Schedule the cron job to run the updateDailyBalances function every 10 seconds
cron.schedule("*/10 * * * * *", updateDailyBalances);

const updateSubscriptionPlan = asyncHandler(async (req, res) => {
  const { userId, subscriptionPlan } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { subscriptionPlan },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      user: {
        fullName: user.fullName,
        email: user.email,
        subscriptionPlan: user.subscriptionPlan,
        balance: user.balance,
        userId: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

const addBalance = async (userId, amount) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    // console.log(
    //   `Added ${amount} to user ${userId}'s balance. New balance: ${user.balance}`
    // );
  } catch (error) {
    console.error(`Error updating balance: ${error.message}`);
    throw error;
  }
};

const createUsers = async (req, res) => {
  try {
    const { fullName, email, password, referer } = await req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the referrer exists
    let referrerUser = null;
    if (referer) {
      referrerUser = await userModel.findOne({ referralCode: referer });
      if (!referrerUser) {
        return res.status(400).json({ message: "Invalid Referrer Code" });
      }
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    try {
      const newUser = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
        referer: referer ? referer : "",
      });

      // If there's a referrer, handle the referral logic
      if (referrerUser) {
        // Assuming you have a function to add balance, and assuming the bonus is 200
        const bonusAmount = 200;

        // Add bonus to the referrer's balance
        // addBalance(referrerUser._id, bonusAmount);

        // Add bonus to the referred user's balance
        // addBalance(newUser._id, bonusAmount);

        // Log the referral for tracking or analytics
        console.log(`User ${referrerUser._id} referred user ${newUser._id}.`);
      }

      const token = generateJwtToken(newUser.id);
      res.status(201).json({
        status: "success",
        user: {
          fullName: newUser.fullName,
          email: newUser.email,
          token,
          userId: newUser._id,
        },
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const loginUsers = asyncHandler(async (req, res) => {
  const { email, password } = await req.body;
  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      const user = await bcrypt.compare(password, userExists.password);
      if (user) {
        const token = generateJwtToken(userExists._id);
        req.user = {
          fullName: userExists.fullName,
          email: userExists.email,
          token,
        };
        res.header;
        res.setHeader("Authorization", token);
        console.log(res.getHeader("authorization"));
        req.headers = {
          authorization: token,
        };
        console.log(req.headers.authorization);
        res.status(200).json({ status: "success", user: req.user });
      } else {
        res
          .status(404)
          .json({ status: "fail", message: "Invalid Login Details" });
      }
    } else {
      res.status(404).json({ status: "fail", message: "User not Found" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userModel.find().exec();
    if (users) {
      res.status(200).json({
        users,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Cannot GET Users.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      error,
    });
  }
});

const generateJwtToken = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = {
  createUsers,
  loginUsers,
  getUsers,
  getAllUsers,
  updateSubscriptionPlan,
};
