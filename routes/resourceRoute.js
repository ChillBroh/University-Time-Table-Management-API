const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const resourceController = require("../controllers/resourceController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("Admin"),
    resourceController.addResource
  )
  .get(authController.protect, resourceController.getAllResources)
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    resourceController.deleteResource
  );

router
  .route("/:id")
  .patch(authController.protect, resourceController.updateResource);

module.exports = router;
