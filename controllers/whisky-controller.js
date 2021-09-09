const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");

exports.allWhisky = async function (req, res, next) {
  // todo sort list for display purposes
  const whiskies = await Whisky.find({})
    .populate("category")
    .populate("distillery")
    .exec();
  res.render("whisky", { title: "All Whiskies", whiskies: whiskies });
};

exports.getWhisky = async function (req, res, next) {
  res.send("not implemented");
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
