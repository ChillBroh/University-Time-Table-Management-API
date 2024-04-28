const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentEnrollment = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  enrollmentDate: {
    type: Date,
    required: true,
  },
});

const studentEnroll = mongoose.model("StudentEnrollment", StudentEnrollment);
module.exports = studentEnroll;
