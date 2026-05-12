const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const { logout } = require("../controller/customerController");


// Multer middleware for two images
const upload = customerController.upload.fields([
  { name: "itemImage", maxCount: 1 },
  { name: "customerImage", maxCount: 1 },
]);

// ---------------- Routes ----------------

// Step 1: Save customer details
router.post("/", customerController.addCustomer);

// Step 2: Upload optional images
router.post(
  "/upload/:id",
  customerController.upload.fields([
    { name: "itemImage", maxCount: 1 },
    { name: "customerImage", maxCount: 1 },
  ]),
  customerController.uploadCustomerImages
);


// ✅ Get all customers
router.get("/", customerController.getAllCustomers);
// ✅ Get existing customers (status = 1)
router.get("/existing", customerController.getExistingCustomers);
router.get("/next-item-code", customerController.getNextItemCode);
router.get("/monthly-customer-count", customerController.getMonthlyCustomerCount);

router.get("/dashboard/stats",  customerController.getDashboardStats);
router.get("/:id", customerController.getCustomerById);
// ✅  invoice 
// router.get("/invoice/:id", customerController.getInvoiceById);
router.get(
  "/invoice/:customerId/:itemCode",
  customerController.getInvoiceByCustomerAndItem
);
// ✅ Update customer (with optional images)
router.put("/:id", upload, customerController.updateCustomerFull);

// ✅ Soft delete → sets currentAvailableValue = 1
router.delete("/:id", customerController.deleteCustomer);

router.post("/logout", logout);

// ✅ Restore customer → sets currentAvailableValue = 0
router.put("/restore/:id", customerController.restoreCustomer);

router.get('/:customerId/item/:itemCode', customerController.getCustomerItemDetails);
router.post("/customer/:customerId/item/:itemCode/close-loan", customerController.closeLoan);

router.put("/restore-item/:customerId/:itemCode", customerController.restoreItem);

module.exports = router;
