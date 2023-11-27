const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUsers,
  loginUser,
} = require("../controllers/userController");
const protect = require("./../middlewares/userAuthMiddleware");

router.route("/").get(protect, getUsers).post(createUsers);
router.route("/login").post(loginUser);

// router.get("/getUsers", getUsers);
// router.post("/signup", createUsers);
// router.post("/login", loginUser);

module.exports = router;
