const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  createEnrollment,
  unEnroll,
} = require("../controllers/studentEnrollmentController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Student", "Faculty", "Admin"),
    createEnrollment
  )
  .delete(
    authController.protect,
    authController.restrictTo("Faculty", "Admin"),
    unEnroll
  );

module.exports = router;
