const express = require("express");
const router = express.Router();
const jewelleryController = require("../controller/jewelleryController");

// POST /api/customer/:customerId/add
router.get("/summary", jewelleryController.getJewellerySummary);

router.post("/:customerId/add", jewelleryController.addJewellery);
module.exports = router;
