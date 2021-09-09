var mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

module.exports = mongoose.model("Category", CategorySchema);
