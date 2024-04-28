const Course = require("../models/coursesModal");
const Enroll = require("../models/studentEnrollment");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Filter = require("../utils/filter");

const createEnrollment = catchAsync(async (req, res, next) => {
  const { studentId, courseCode } = req.body;

  const course = await Course.findOne({
    courseCode: courseCode,
  });
  if (!course) {
    return next(new AppError("Course not found"), 404);
  }
  const student = await Enroll.findOne({
    studentId: studentId ? studentId : req.user._id,
    courseId: course._id,
  });
  if (student) {
    return next(
      new AppError(
        `${req.user.userName} is already enrolled to ${course.courseName} on ${student.enrollmentDate}`
      )
    );
  }

  const newStudentEnrollment = new Enroll({
    studentId: studentId ? studentId : req.user._id,
    courseId: course._id,
    enrollmentDate: Date.now(),
  });

  const savedStudentEnrollment = await newStudentEnrollment.save();

  res.status(201).json({
    status: "success",
    data: {
      message: "Student enrollment success!",
      enroll: savedStudentEnrollment,
    },
  });
});

const unEnroll = catchAsync(async (req, res, next) => {
  const { studentId, courseId } = req.body;
  const student = await Enroll.findOne({
    studentId: studentId,
    courseId: courseId,
  });
  if (!student) {
    return next(new AppError("No Enrollment Found"));
  }
  //remove enrollment
  await Enroll.findByIdAndDelete(student._id);

  res.status(204).end();
});

module.exports = { createEnrollment, unEnroll };
