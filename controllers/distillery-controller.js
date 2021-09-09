const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");

exports.allDistillery = async function (req, res, next) {
  const distilleries = await Distillery.find().exec();
  res.render("distillery-list", {
    title: "All Distilleries",
    distilleries: distilleries,
  });
};

exports.getDistillery = async function (req, res, next) {
  const distillery = await Distillery.findById(req.params.id).exec();
  const whiskies = await Whisky.find({ distillery: req.params.id })
    .populate("category")
    .exec();
  res.render("whisky-list", {
    title: distillery.name,
    distillery: distillery,
    whiskies: whiskies,
  });
};

exports.createDistilleryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.createDistilleryPOST = async function (req, res, next) {
  res.send("not implemented");
};

exports.editDistilleryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.editDistilleryPost = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteDistilleryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteDistilleryPost = async function (req, res, next) {
  res.send("not implemented");
};
