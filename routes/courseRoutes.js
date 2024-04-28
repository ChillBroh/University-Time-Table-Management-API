const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getOneCourse,
} = require("../controllers/courseController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Admin"),
    createCourse
  )
  .get(authController.protect, getAllCourses);

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    deleteCourse
  )
  .get(authController.protect, getOneCourse);

module.exports = router;
