const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");
const async = require("async");

// display all whiskies
exports.allWhisky = async function (req, res, next) {
  try {
    // sort based on query parameter
    let sortBy = "price";
    if (req.query.sort) {
      sortBy = req.query.sort;
    }

    const whiskies = await Whisky.find({})
      .populate("category")
      .populate("distillery")
      .sort(sortBy)
      .exec();
    res.render("whisky-list", {
      title: "Whiskies",
      whiskies: whiskies,
      currentUrl: req.baseUrl + "/all",
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

// display a specific whisky
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
  // get category/distillery values for selection drop downs on form
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
        err.message = "Something went wrong.";
        err.status = 500;
        return next(err);
      }
      if (results.categories === null) {
        const err = new Error(
          "No Categories found. Add Categories before adding Whisky"
        );
        err.status = 404;
        return next(err);
      }
      if (results.distilleries === null) {
        const err = new Error(
          "No Distilleries found. Add Distilleries before adding Whisky"
        );
        err.status = 404;
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

// handle new whisky form submission/validation
exports.createWhiskyPOST = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must not be empty"),
  body("description").trim(),
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

// form to edit a whisky
exports.editWhiskyGet = async function (req, res, next) {
  // get whisky info and category/distillery values for selection drop downs on form
  async.parallel(
    {
      whisky: (callback) => {
        Whisky.findById(req.params.id)
          .populate("category")
          .populate("distillery")
          .exec(callback);
      },
      categories: (callback) => {
        Category.find().exec(callback);
      },
      distilleries: (callback) => {
        Distillery.find().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        err.message = "Something went wrong.";
        err.status = 500;
        return next(err);
      }
      if (results.whisky === null) {
        const err = new Error("Whisky not found");
        err.status = 404;
        return next(err);
      }
      if (results.categories === null) {
        const err = new Error(
          "No Categories found. Add Categories before adding Whisky"
        );
        err.status = 404;
        return next(err);
      }
      if (results.distilleries === null) {
        const err = new Error(
          "No Distilleries found. Add Distilleries before adding Whisky"
        );
        err.status = 404;
        return next(err);
      }
      res.render("whisky-form", {
        title: "Edit Whisky",
        whisky: results.whisky,
        categories: results.categories,
        distilleries: results.distilleries,
      });
    }
  );
};

// handle edit whisky form submission/validation
exports.editWhiskyPost = [
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
      // if validation errors exist - get category/distillery values for selection drop downs on form and send user back to form
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
            err.message = "Something went wrong.";
            err.status = 500;
            return next(err);
          }
          if (results.categories === null) {
            const err = new Error(
              "No Categories found. Add Categories before adding Whisky"
            );
            err.status = 404;
            return next(err);
          }
          if (results.distilleries === null) {
            const err = new Error(
              "No Distilleries found. Add Distilleries before adding Whisky"
            );
            err.status = 404;
            return next(err);
          }

          res.render("whisky-form", {
            title: "Edit Whisky",
            whisky: req.body,
            categories: results.categories,
            distilleries: results.distilleries,
          });
        }
      );
    } else {
      // no validation errors - update database and redirect to edited whisky
      const whisky = new Whisky({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stockQuantity: req.body.stockQuantity,
        imgUrl: req.body.imgUrl,
        category: req.body.category,
        distillery: req.body.distillery,
      });
      Whisky.findByIdAndUpdate(
        req.params.id,
        whisky,
        {},
        function (err, whisky) {
          if (err) {
            return next(err);
          }
          res.redirect(whisky.url);
        }
      );
    }
  },
];

// confirmation page/form for deleteing a whisky
exports.deleteWhiskyGet = async function (req, res, next) {
  try {
    const whisky = await Whisky.findById(req.params.id)
      .populate("category")
      .populate("distillery")
      .exec();

    if (whisky === null) {
      const err = new Error("Whisky not found");
      err.status = 404;
      return next(err);
    }

    res.render("whisky-delete", {
      title: "Delete Whisky",
      whisky: whisky,
      authorised: req.query.authorised,
    });
  } catch (err) {
    err.message = "Something went wrong";
    err.status = 500;
    return next(err);
  }
};

// handle delete whisky form submission
exports.deleteWhiskyPost = async function (req, res, next) {
  try {
    // if admin password incorrect redirect back to delete confirmation
    if (req.body.adminPassword !== process.env.ADMIN_PASSWORD) {
      res.redirect(`/whisky/${req.params.id}/delete/?authorised=false`);
    } else {
      // admin password correct - delete whisky
      await Whisky.findByIdAndDelete(req.params.id);
      res.redirect("/whisky/all");
    }
  } catch (err) {
    err.message = "Something went wrong";
    err.status = 500;
    return next(err);
  }
};
