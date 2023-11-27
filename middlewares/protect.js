const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.SECRET);
      req.user = userModel.findById(decodedToken.id).select("-password");
    }
    next();
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "An Error occured!!!",
    });
  }

  if (!token) {
    res.status(404).json({
      status: "fail",
      message: "User not authorized",
    });
  }
});

module.exports = { protect };
