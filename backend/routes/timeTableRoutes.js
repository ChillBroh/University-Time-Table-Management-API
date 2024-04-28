const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const timeTableController = require("../controllers/timeTableController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Admin"),
    timeTableController.addTimeTable
  );

module.exports = router;
