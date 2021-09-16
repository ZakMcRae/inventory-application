var express = require("express");
var router = express.Router();

var resetDb = require("../util/loadSampleDb");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Whisky Warehouse" });
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
