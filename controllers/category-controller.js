const Whisky = require("../models/whisky");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");

// retrieve all categories from database an display in list view
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

// retrieve specific category from database and display category info and all whiskies in specific category
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
      // throw 500 rather than show user specific error when id is invalid
      if (err) {
        err.message = "Something went wrong";
        err.status = 500;
        return next(err);
      }
      // if category not found in database throw 404
      if (results.category === null) {
        const err = new Error("Category not found");
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

// form for creating a new category
exports.createCategoryGet = async function (req, res, next) {
  res.render("category-form", { title: "Create New Category" });
};

// handle new category form submission
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

// form to edit category information
exports.editCategoryGet = async function (req, res, next) {
  try {
    const category = await Category.findById(req.params.id).exec();
    res.render("category-form", {
      title: "All Categories",
      category: category,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

// handle edit category form submission
exports.editCategoryPost = [
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
        title: "Edit Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id,
      });

      Category.findByIdAndUpdate(
        req.params.id,
        category,
        {},
        function (err, category) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(category.url);
        }
      );
    }
  },
];

// confirmation page/form for deleteing a category
exports.deleteCategoryGet = async function (req, res, next) {
  // get data from database
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
      // throw 500 rather than show user specific error when category id is invalid
      if (err) {
        err.message = "Something went wrong";
        err.status = 500;
        return next(err);
      }
      // if category not found in database throw 404
      if (results.category == null) {
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // display data on form
      // authorised=false is passed as a query parameter from the post route if admin password is incorrect
      res.render("category-delete", {
        title: "Delete Category",
        category: results.category,
        whiskies: results.whiskies,
        authorised: req.query.authorised,
      });
    }
  );
};

// handle confirmation page/form for deleteing a category
exports.deleteCategoryPost = async function (req, res, next) {
  try {
    // if admin password incorrect redirect back to delete confirmation
    if (req.body.adminPassword !== process.env.ADMIN_PASSWORD) {
      res.redirect(`/category/${req.params.id}/delete/?authorised=false`);
    } else {
      // admin password correct - delete category
      await Category.findByIdAndDelete(req.params.id);
      res.redirect("/category/all");
    }
  } catch (err) {
    err.message = "Something went wrong";
    err.status = 500;
    return next(err);
  }
};
