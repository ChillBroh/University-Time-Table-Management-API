const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResourcesSchema = new Schema({
  resourceId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["ClassRoom", "Electronic", "Other"],
  },
  availability: {
    type: Boolean,
    required: true,
  },
});

const Resources = mongoose.model("Resources", ResourcesSchema);
module.exports = Resources;
