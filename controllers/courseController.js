const Course = require("../models/coursesModal");
const User = require("../models/usersModal");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Filter = require("../utils/filter");

const createCourse = catchAsync(async (req, res, next) => {
  const { courseCode, courseName, description, credits, department, faculty } =
    req.body;
  const existingCourse = await Course.findOne({ courseCode });
  if (existingCourse) {
    return next(new AppError("Course already exists!", 400));
  }
  const facultyIds = [];
  for (const fac of faculty) {
    const user = await User.findOne({ _id: fac });

    if (user && user.role == "Faculty") {
      facultyIds.push(user._id);
    } else {
      return next(
        new AppError(`${fac} is neither a staff member nor a registered user!`)
      );
    }
  }

  const newCourse = new Course({
    courseCode,
    courseName,
    description,
    credits,
    department,
    createdBy: req.user.email,
    faculty,
  });

  const savedCourse = await newCourse.save();
  res.status(201).json({
    data: savedCourse,
    Message: "Course Created",
  });
});

const getAllCourses = catchAsync(async (req, res, next) => {
  let respond = new Filter(Course.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const courses = await respond.query;
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

const getOneCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;
  const course = await Course.findOne({ courseCode: courseId });

  if (!course) {
    return next(new AppError("Course Not Found!", 404));
  }
  res.status(201).json({
    status: "success",
    course,
  });
});

const updateCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;
  const updatedDetails = req.body;

  if (updatedDetails.faculty) {
    for (const fac of updatedDetails.faculty) {
      const user = await User.findOne({ _id: fac });
      console.log(fac);

      if (!user || user.role != "Faculty") {
        return next(
          new AppError(
            `${fac} is neither a staff member nor a registered user!`
          )
        );
      }
    }
  }

  const course = await Course.findOneAndUpdate(
    { courseCode: courseId }, // Filter criteria
    { $set: updatedDetails }, // Update data using $set operator
    { new: true } // Return the updated document
  );

  if (!course) {
    return next(new AppError("Course Not Found!", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      course,
    },
  });
});

const deleteCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;
  const course = await Course.findOneAndDelete({ courseCode: courseId });

  if (!course) {
    return next(new AppError("Course Not Found!", 404));
  }
  res.status(204).end();
});

module.exports = {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  getOneCourse,
};
