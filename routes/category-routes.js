var express = require("express");
var router = express.Router();

const categoryController = require("../controllers/category-controller");

// display all categories in database
router.get("/all", categoryController.allCategory);

// create new category - GET
router.get("/create", categoryController.createCategoryGet);

// create new category - POST
router.post("/create", categoryController.createCategoryPOST);

// edit category - GET
router.get("/:id/edit", categoryController.editCategoryGet);

// edit category - POST
router.post("/:id/edit", categoryController.editCategoryPost);

// delete category - GET
router.get("/:id/delete", categoryController.deleteCategoryGet);

// delete category - POST
router.post("/:id/delete", categoryController.deleteCategoryPost);

// display specific category
router.get("/:id", categoryController.getCategory);

module.exports = router;
