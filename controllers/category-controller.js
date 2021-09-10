const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");

exports.allCategory = async function (req, res, next) {
  const categories = await Category.find({}).exec();
  res.render("category-list", {
    title: "All Categories",
    categories: categories,
  });
};

exports.getCategory = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id).exec();
    const whiskies = await Whisky.find({ category: req.params.id })
      .populate("distillery")
      .exec();

    // if category not found in database throw 404
    if (category === null) {
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("whisky-list", {
      title: category.name,
      category: category,
      whiskies: whiskies,
    });
    // throwing 404 error in place of real error to user
  } catch (err) {
    if (err) {
      var err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }
  }
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
