const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookResourcesSchema = new Schema({
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: "Resources",
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  bookedDate: {
    type: Date,
    default: Date.now(),
  },
});

const BookResources = mongoose.model("BookResource", BookResourcesSchema);
module.exports = BookResources;
