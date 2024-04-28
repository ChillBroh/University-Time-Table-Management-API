const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: [
      "Time Table Changed",
      "Room Changed",
      "Announcement",
      "Enrolled",
      "UnEnrolled",
    ],
  },
  message: {
    type: String,
    required: true,
  },
  recipients: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: {
    type: Date,
    defalut: Date.now(),
  },
});

const Notifications = mongoose.model("Notifications", NotificationsSchema);
module.exports = Notifications;
