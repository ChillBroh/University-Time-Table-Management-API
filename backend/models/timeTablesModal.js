const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimeTableSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Courses",
  },
  eventName: {
    type: String,
  },
  dayOfWeek: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Resources",
  },
});

const TimeTable = mongoose.model("TimeTables", TimeTableSchema);
module.exports = TimeTable;
