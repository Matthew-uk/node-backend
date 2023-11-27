const jwt = require("jsonwebtoken");
const userModel = require("./../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get Token from Headers
      token = req.headers.authorization.split(" ")[1];

      //Get User from the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      //Get User id from token
      req.user = await userModel.findById(decodedToken.id).select("-password");

      console.log(req.headers);

      next();
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
      // throw new Error("User not Authorized");
    }
  }

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "User not Authorized due to lack of token",
    });
    // throw new Error("User not Authorized");
  }
});

module.exports = protect;
