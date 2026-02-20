const express = require("express");
const router = express.Router();
const interestController = require("../controller/interestDetailsController");

// CRUD Routes
router.post("/", interestController.addInterest);
router.get("/", interestController.getAllInterests);
router.get("/:customerId", interestController.getInterestByCustomer);
router.put("/:id", interestController.updateInterest);
router.delete("/:id", interestController.deleteInterest);
router.get("/single/:id", interestController.getInterestById);
// router.get("/summary/:customerId", interestController.getCustomerInterestSummary);
// GET /api/interests/summary/:customerId/:itemCode
router.get("/summary/:customerId/:itemCode", interestController.getCustomerInterestSummary);

module.exports = router;
