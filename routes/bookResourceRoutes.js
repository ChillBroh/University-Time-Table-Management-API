const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const bookResourceController = require("../controllers/bookResouceController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Admin", "Faculty"),
    bookResourceController.addBooking
  )
  .get(
    authController.protect,
    authController.restrictTo("Admin", "Faculty", "Student"),
    bookResourceController.getAllBookings
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    bookResourceController.updateBooking
  );

module.exports = router;
