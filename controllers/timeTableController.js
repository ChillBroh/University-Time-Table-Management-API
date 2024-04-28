const TimeTable = require("../models/timeTablesModal");
const catchAsync = require("../utils/catchAsync");
const Course = require("../models/coursesModal");
const Users = require("../models/usersModal");
const Resources = require("../models/resourcesModal");
const Notifications = require("../models/notificationModal");
const studentEnroll = require("../models/studentEnrollment");
const BookResouce = require("../models/bookResource");
const { addBooking } = require("../controllers/bookResouceController");
const AppError = require("../utils/AppError");

const addTimeTable = catchAsync(async (req, res, next) => {
  const { dayOfWeek, startTime, endTime, faculty, location } = req.body;
  const checkTimetable = await TimeTable.findOne({
    location: location,
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
  console.log(checkTimetable);
  if (checkTimetable) {
    console.log("hello");
    return next(
      new AppError(
        `Cannot add this time table! There is already a time table from ${checkTimetable.startTime} to ${checkTimetable.endTime}!`,
        400
      )
    );
  }
  let course = null;
  let event = null;

  if (req.body.courseId) {
    course = await Course.findOne({
      _id: req.body.courseId,
    });

    const checkFaculty = course.faculty.includes(faculty);

    if (!checkFaculty) {
      return next(new AppError("Lecturer is not assigned to this course!"));
    }

    if (!course) {
      return next(new AppError("Course not found!", 404));
    }
  } else if (req.body.eventName) {
    event = req.body.eventName;
  } else {
    return next(
      new AppError("Either courseId or eventName must be provided!", 400)
    );
  }

  const lecturer = await Users.findOne({ _id: faculty, availability: true });

  if (!lecturer) {
    return next(new AppError("Lecturer is not available"), 404);
  }

  const checkBookings = await BookResouce.findOne({
    resourceId: req.body.location,
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
        `Location is not available from ${checkBookings.startTime} to ${checkBookings.endTime}`
      )
    );
  }

  const newTimeTable = new TimeTable({
    course: course ? course._id : null,
    eventName: event ?? null,
    dayOfWeek,
    startTime,
    endTime,
    faculty,
    location: req.body.resourceId,
  });
  const savedTimetable = await newTimeTable.save();

  if (!savedTimetable) {
    return next(new AppError("Time table not saved!"), 500);
  }
  if (course) {
    const enrolledStudents = await studentEnroll.find({
      courseId: course._id,
    });
    const studentIds = enrolledStudents.map(
      (enrollment) => enrollment.studentId
    );

    const recipients = [...studentIds, faculty];

    const notification = new Notifications({
      type: "Time Table Changed",
      message: `Time table added from ${newTimeTable.startTime} to ${newTimeTable.endTime}`,
      recipients: recipients,
    });

    await notification.save();
  }
  res.status(200).json({
    data: savedTimetable,
  });
});

const removeExpiredTimetables = catchAsync(async () => {
  console.log("check");
  const expiredTimetable = await TimeTable.find({
    endTime: { $lt: new Date() },
  });

  for (const timeTable of expiredTimetable) {
    await Resources.findOneAndUpdate(
      { _id: timeTable.location },
      { availability: true }
    );
    await TimeTable.findOneAndDelete({ _id: timeTable._id });
  }
});
module.exports = { addTimeTable, removeExpiredTimetables };
