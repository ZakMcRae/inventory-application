var express = require("express");
var router = express.Router();

const Whisky = require("../models/whisky");
const Category = require("../models/category");
const Distillery = require("../models/distillery");
const async = require("async");

var resetDb = require("../util/loadSampleDb");

/* GET home page. */
router.get("/", function (req, res, next) {
  async.parallel(
    {
      whiskyCount: (callback) => {
        Whisky.count().exec(callback);
      },
      categoryCount: (callback) => {
        Category.count().exec(callback);
      },
      distilleryCount: (callback) => {
        Distillery.count().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        err.message = "Something Went Wrong";
        err.status = 500;
        return next(err);
      }

      res.render("index", {
        title: "Whisky Warehouse",
        whiskyCount: results.whiskyCount,
        categoryCount: results.categoryCount,
        distilleryCount: results.distilleryCount,
      });
    }
  );
});

// route to reset database - url is /reset?pw=Admin_Password
router.get("/reset", async function (req, res, next) {
  if (req.query.pw === process.env.ADMIN_PASSWORD) {
    await resetDb();
    setTimeout(() => {
      res.redirect("/whisky/all");
    }, 3000);
  } else {
    res.redirect("/whisky/all");
  }
});

module.exports = router;
