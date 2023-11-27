const express = require("express");
const router = express.Router();
const protect = require("./../middlewares/userAuthMiddleware");
const { getGoals, createGoal } = require("./../controllers/goalControllers");

router.route("/").get(protect, getGoals).post(protect, createGoal);

module.exports = router;
