var express = require("express");
var router = express.Router();

const distilleryController = require("../controllers/distillery-controller");

// display all categories in database
router.get("/all", distilleryController.allDistillery);

// create new distillery - GET
router.get("/create", distilleryController.createDistilleryGet);

// create new distillery - POST
router.post("/create", distilleryController.createDistilleryPOST);

// edit distillery - GET
router.get("/:id/edit", distilleryController.editDistilleryGet);

// edit distillery - POST
router.post("/:id/edit", distilleryController.editDistilleryPost);

// delete distillery - GET
router.get("/:id/delete", distilleryController.deleteDistilleryGet);

// delete distillery - POST
router.post("/:id/delete", distilleryController.deleteDistilleryPost);

// display specific distillery
router.get("/:id", distilleryController.getDistillery);

module.exports = router;
