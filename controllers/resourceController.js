const Resources = require("../models/resourcesModal");
const catchAsync = require("../utils/catchAsync");
const Filter = require("../utils/filter");
const AppError = require("../utils/AppError");

const addResource = catchAsync(async (req, res, next) => {
  const { resourceId, name, type, availability } = req.body;

  const newResource = new Resources({
    resourceId,
    name,
    type,
    availability,
  });
  const savedResource = await newResource.save();
  res.status(201).json({
    data: savedResource,
    Message: "Resource Created",
  });
});

const getAllResources = catchAsync(async (req, res, next) => {
  let respond = new Filter(Resources.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const resources = await respond.query;
  res.status(200).json({
    status: "success",
    data: resources,
  });
});

const updateResource = catchAsync(async (req, res, next) => {
  const resourceId = req.params.id;
  const updatedDetails = req.body;
  const types = ["ClassRoom", "Electronic", "Other"];
  if (updatedDetails.type && !types.includes(updatedDetails.type)) {
    return next(new AppError("Type is invalid!"));
  }
  const resource = await Resources.findOneAndUpdate(
    { resourceId: resourceId }, // Filter criteria
    { $set: updatedDetails }, // Update data using $set operator
    { new: true } // Return the updated document
  );

  if (!resource) {
    return next(new AppError("Resource Not Found!", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      resource,
    },
  });
});

const deleteResource = catchAsync(async (req, res, next) => {
  const { resourceId } = req.body;

  const resource = await Resources.findOne({ resourceId: resourceId });

  if (!resource) {
    return next(new AppError("Resource Id is invalid!", 404));
  }
  const deleteResource = await Resources.findByIdAndDelete(resource._id);
  if (deleteResource) {
    res.status(204).end();
  }
});
module.exports = {
  addResource,
  getAllResources,
  updateResource,
  deleteResource,
};
