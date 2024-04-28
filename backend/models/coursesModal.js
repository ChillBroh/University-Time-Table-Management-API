const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  faculty: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model("Courses", CourseSchema);
module.exports = Course;
