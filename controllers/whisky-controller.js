const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const whisky = require("../models/whisky");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.allWhisky = async function (req, res, next) {
  try {
    // todo sort list for display purposes - possibly add filter options
    const whiskies = await Whisky.find({})
      .populate("category")
      .populate("distillery")
      .exec();
    res.render("whisky-list", { title: "Whiskies", whiskies: whiskies });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

exports.getWhisky = async function (req, res, next) {
  try {
    const whisky = await Whisky.findById(req.params.id)
      .populate("category")
      .populate("distillery")
      .exec();

    // if no whisky found in database throw 404
    if (whisky === null) {
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
    res.render("whisky-detail", { title: whisky.name, whisky: whisky });
  } catch (err) {
    // throw 500 rather than show user specific error when id is invalid
    var err = new Error("Something went wrong");
    err.status = 500;
    return next(err);
  }
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
