const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.allDistillery = async function (req, res, next) {
  const distilleries = await Distillery.find().exec();
  res.render("distillery-list", {
    title: "All Distilleries",
    distilleries: distilleries,
  });
};

exports.getDistillery = async function (req, res, next) {
  async.parallel(
    {
      distillery: (callback) => {
        Distillery.findById(req.params.id).exec(callback);
      },
      whiskies: (callback) => {
        Whisky.find({ distillery: req.params.id })
          .populate("category")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // throw 500 rather than show user specific error when id is invalid
        var err = new Error("Something went wrong");
        err.status = 500;
        return next(err);
      }
      // if distillery not found in database throw 404
      if (results.distillery === null) {
        var err = new Error("Distillery not found");
        err.status = 404;
        return next(err);
      }
      res.render("whisky-list", {
        title: results.distillery.name,
        distillery: results.distillery,
        whiskies: results.whiskies,
      });
    }
  );
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
