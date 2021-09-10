const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.allDistillery = async function (req, res, next) {
  try {
    const distilleries = await Distillery.find().exec();
    res.render("distillery-list", {
      title: "All Distilleries",
      distilleries: distilleries,
    });
  } catch (err) {
    if (err) {
      next(err);
    }
  }
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
  res.render("distillery-form", { title: "Create New Distillery" });
};

exports.createDistilleryPOST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must not be empty"),
  body("location")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Location must not be empty"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("distillery-form", {
        title: "Create New Distillery",
        distillery: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const distillery = new Distillery({
        name: req.body.name,
        location: req.body.location,
      });
      distillery.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(distillery.url);
      });
    }
  },
];

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
