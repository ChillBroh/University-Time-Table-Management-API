const BookResouce = require("../models/bookResource");
const Resources = require("../models/resourcesModal");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Filter = require("../utils/filter");

const addBooking = catchAsync(async (req, res, next) => {
  const { resourceId, startTime, endTime, bookFromDate, bookToDate } = req.body;
  console.log(resourceId);
  const resourceAvailability = await Resources.findOne({
    _id: resourceId,
    availability: true,
  });
  if (!resourceAvailability) {
    return next(new AppError("Resource Not available!", 503));
  }
  const checkBookings = await BookResouce.findOne({
    resourceId: resourceId,
    $or: [
      {
        $and: [
          { startTime: { $lte: startTime } },
          { endTime: { $gte: startTime } },
        ],
      },
      {
        $and: [
          { startTime: { $lte: endTime } },
          { endTime: { $gte: endTime } },
        ],
      },
      {
        $and: [
          { startTime: { $gte: startTime } },
          { endTime: { $lte: endTime } },
        ],
      },
    ],
  });

  if (checkBookings) {
    return next(
      new AppError(
        `This Resource is already booked from ${checkBookings.startTime} to ${checkBookings.endTime}`
      )
    );
  }

  const bookingRequest = new BookResouce({
    resourceId: resourceAvailability._id,
    bookedBy: req.user._id,
    startTime,
    endTime,
  });

  const bookResource = await bookingRequest.save();

  res.status(201).json({
    status: "success",
    data: {
      message: "booked",
      data: bookResource,
    },
  });
});

const getAllBookings = catchAsync(async (req, res, next) => {
  let bookings = new Filter(BookResouce.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const allBookings = await bookings.query;
  res.status(200).json({
    status: "success",
    data: allBookings,
  });
});

const updateBooking = catchAsync(async (req, res, next) => {
  const bookingId = req.params.id;
  const updatedDetails = req.body;

  const updatedBooking = await BookResouce.findOneAndUpdate(
    { _id: bookingId }, // Filter criteria
    { $set: updatedDetails }, // Update data using $set operator
    { new: true } // Return the updated document
  );

  if (!updatedBooking) {
    return next(new AppError("Booking details Not Found!", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      updateBooking,
    },
  });
});

module.exports = { addBooking, getAllBookings, updateBooking };
