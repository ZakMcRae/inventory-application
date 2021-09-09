const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const whisky = require("../models/whisky");

exports.allWhisky = async function (req, res, next) {
  // todo sort list for display purposes - possibly add filter options
  const whiskies = await Whisky.find({})
    .populate("category")
    .populate("distillery")
    .exec();
  res.render("whisky-list", { title: "Whiskies", whiskies: whiskies });
};

exports.getWhisky = async function (req, res, next) {
  const whisky = await Whisky.findById(req.params.id)
    .populate("category")
    .populate("distillery")
    .exec();
  res.render("whisky-detail", { title: whisky.name, whisky: whisky });
};

exports.createWhiskyGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.createWhiskyPOST = async function (req, res, next) {
  res.send("not implemented");
};

exports.editWhiskyGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.editWhiskyPost = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteWhiskyGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteWhiskyPost = async function (req, res, next) {
  res.send("not implemented");
};
