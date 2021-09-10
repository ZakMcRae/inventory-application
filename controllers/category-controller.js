const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");
const async = require("async");

exports.allCategory = async function (req, res, next) {
  try {
    const categories = await Category.find({}).exec();
    res.render("category-list", {
      title: "All Categories",
      categories: categories,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

exports.getCategory = async function (req, res, next) {
  async.parallel(
    {
      category: (callback) => {
        Category.findById(req.params.id).exec(callback);
      },
      whiskies: (callback) => {
        Whisky.find({ category: req.params.id })
          .populate("distillery")
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
      // if category not found in database throw 404
      if (results.category === null) {
        var err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      res.render("whisky-list", {
        title: results.category.name,
        category: results.category,
        whiskies: results.whiskies,
      });
    }
  );
};

exports.createCategoryGet = async function (req, res, next) {
  res.render("category-form", { title: "Create New Category" });
};

exports.createCategoryPOST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must not be empty"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must not be empty"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("category-form", {
        title: "Create New Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      });
      category.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(category.url);
      });
    }
  },
];

exports.editCategoryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.editCategoryPost = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteCategoryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.deleteCategoryPost = async function (req, res, next) {
  res.send("not implemented");
};
