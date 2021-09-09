const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");

exports.allCategory = async function (req, res, next) {
  const categories = await Category.find({}).exec();
  res.render("category-list", {
    title: "All Categories",
    categories: categories,
  });
};

exports.getCategory = async function (req, res, next) {
  const category = await Category.findById(req.params.id).exec();
  const whiskies = await Whisky.find({ category: req.params.id })
    .populate("distillery")
    .exec();
  res.render("whisky-list", {
    title: category.name,
    category: category,
    whiskies: whiskies,
  });
};

exports.createCategoryGet = async function (req, res, next) {
  res.send("not implemented");
};

exports.createCategoryPOST = async function (req, res, next) {
  res.send("not implemented");
};

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
