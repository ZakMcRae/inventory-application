var mongoose = require("mongoose");

var WhiskySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number },
  imgUrl: { type: String },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  distillery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Distillery",
    required: true,
  },
});

WhiskySchema.virtual("url").get(function () {
  return "/whisky/" + this.__id;
});

module.exports = mongoose.model("Whisky", WhiskySchema);
