var mongoose = require("mongoose");

var DistillerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
});

DistillerySchema.virtual("url").get(function () {
  return "/distillery/" + this._id;
});

module.exports = mongoose.model("Distillery", DistillerySchema);
