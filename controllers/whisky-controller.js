const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
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
    err.message = "Something went wrong";
    err.status = 500;
    return next(err);
  }
};

// form for creating a new whisky
exports.createWhiskyGet = async function (req, res, next) {
  async.parallel(
    {
      categories: (callback) => {
        Category.find().exec(callback);
      },
      distilleries: (callback) => {
        Distillery.find().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.categories === null) {
        const err = new Error(
          "No Categories found. Add Categories before adding Whisky"
        );
        err.status(404);
        return next(err);
      }
      if (results.distilleries === null) {
        const err = new Error(
          "No Distilleries found. Add Distilleries before adding Whisky"
        );
        err.status(404);
        return next(err);
      }
      res.render("whisky-form", {
        title: "Add New Whisky",
        categories: results.categories,
        distilleries: results.distilleries,
      });
    }
  );
};

// handle new whisky form submission
exports.createWhiskyPOST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must not be empty"),
  body("description").trim().escape(),
  body("price").trim().escape(),
  body("stockQuantity").trim().escape(),
  body("imgUrl").trim(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("whisky-form", {
        title: "Add New aWhisky",
        whisky: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const whisky = new Whisky({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stockQuantity: req.body.stockQuantity,
        imgUrl: req.body.imgUrl,
        category: req.body.category,
        distillery: req.body.distillery,
      });
      whisky.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(whisky.url);
      });
    }
  },
];

// todo may have to pass back category and distillery on whiskey-form (category === undefined ? '':category._id)

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
