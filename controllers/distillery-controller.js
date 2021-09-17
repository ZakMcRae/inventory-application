const Whisky = require("../models/whisky");
const Distillery = require("../models/distillery");
const { body, validationResult } = require("express-validator");
const async = require("async");

// retrieve all distilleries from database and display in list view
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

// retrieve specific distillery from database and display distillery info and all whiskies in specific distillery
exports.getDistillery = async function (req, res, next) {
  async.parallel(
    {
      distillery: (callback) => {
        Distillery.findById(req.params.id).exec(callback);
      },
      whiskies: (callback) => {
        Whisky.find({ distillery: req.params.id })
          .populate("category")
          .populate("distillery")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // throw 500 rather than show user specific error when id is invalid
        err.message = "Something went wrong";
        err.status = 500;
        return next(err);
      }
      // if distillery not found in database throw 404
      if (results.distillery === null) {
        err.message = "Distillery not found";
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

// form for creating a new distillery
exports.createDistilleryGet = async function (req, res, next) {
  res.render("distillery-form", { title: "Create New Distillery" });
};

// handle new distillery form submission
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

// form to edit distillery information
exports.editDistilleryGet = async function (req, res, next) {
  try {
    const distillery = await Distillery.findById(req.params.id).exec();
    res.render("distillery-form", {
      title: "Edit Distillery",
      distillery: distillery,
    });
  } catch (err) {
    if (err) {
      return next(err);
    }
  }
};

// handle edit category form submission
exports.editDistilleryPost = [
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
        title: "Edit Distillery",
        distillery: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const distillery = new Distillery({
        name: req.body.name,
        location: req.body.location,
        _id: req.params.id,
      });

      Distillery.findByIdAndUpdate(
        req.params.id,
        distillery,
        {},
        function (err, distillery) {
          if (err) {
            return next(err);
          }
          // Successful - redirect to book detail page.
          res.redirect(distillery.url);
        }
      );
    }
  },
];

// confirmation page/form for deleteing a distillery
exports.deleteDistilleryGet = async function (req, res, next) {
  // get data from database
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
      // throw 500 rather than show user specific error when distillery id is invalid
      if (err) {
        err.message = "Something went wrong";
        err.status = 500;
        return next(err);
      }
      // if distillery not found in database throw 404
      if (results.distillery == null) {
        const err = new Error("Distillery not found");
        err.status = 404;
        return next(err);
      }
      // display data on form
      // authorised=false is passed as a query parameter from the post route if admin password is incorrect
      res.render("distillery-delete", {
        title: "Delete Distillery",
        distillery: results.distillery,
        whiskies: results.whiskies,
        authorised: req.query.authorised,
      });
    }
  );
};

// handle confirmation page/form for deleteing a distillery
exports.deleteDistilleryPost = async function (req, res, next) {
  try {
    // if admin password incorrect redirect back to delete confirmation
    if (req.body.adminPassword !== process.env.ADMIN_PASSWORD) {
      res.redirect(`/distillery/${req.params.id}/delete/?authorised=false`);
    } else {
      // admin password correct - delete distillery
      await Distillery.findByIdAndDelete(req.params.id);
      res.redirect("/distillery/all");
    }
  } catch (err) {
    err.message = "Something went wrong";
    err.status = 500;
    return next(err);
  }
};
