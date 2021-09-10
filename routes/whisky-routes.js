var express = require("express");
var router = express.Router();

const whiskyController = require("../controllers/whisky-controller");

// display all whiskies in database
router.get("/all", whiskyController.allWhisky);

// create new whisky - GET
router.get("/create", whiskyController.createWhiskyGet);

// create new whisky - POST
router.post("/create", whiskyController.createWhiskyPOST);

// edit whisky - GET
router.get("/:id/edit", whiskyController.editWhiskyGet);

// edit whisky - POST
router.post("/:id/edit", whiskyController.editWhiskyPost);

// delete whisky - GET
router.get("/:id/delete", whiskyController.deleteWhiskyGet);

// delete whisky - POST
router.post("/:id/delete", whiskyController.deleteWhiskyPost);

// display specific whisky
router.get("/:id", whiskyController.getWhisky);

module.exports = router;
